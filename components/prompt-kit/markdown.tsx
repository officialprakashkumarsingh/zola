import { LinkMarkdown } from "@/app/components/chat/link-markdown"
import { cn } from "@/lib/utils"
import { marked } from "marked"
import { memo, useId, useMemo } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { ButtonCopy } from "../common/button-copy"
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "../prompt-kit/code-block"
import { 
  ChemistryFormula, 
  DisplayChemistry, 
  DisplayMath, 
  InlineMath 
} from "../prompt-kit/math-formula"

export type MarkdownProps = {
  children: string
  id?: string
  className?: string
  components?: Partial<Components>
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

function extractLanguage(className?: string): string {
  if (!className) return "plaintext"
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : "plaintext"
}

const INITIAL_COMPONENTS: Partial<Components> = {
  code: function CodeComponent({ className, children, ...props }) {
    const isInline =
      !props.node?.position?.start.line ||
      props.node?.position?.start.line === props.node?.position?.end.line

    if (isInline) {
      const content = children as string
      
      // Check for LaTeX math delimiters
      if (content.startsWith('$') && content.endsWith('$') && content.length > 2) {
        const mathContent = content.slice(1, -1)
        return <InlineMath>{mathContent}</InlineMath>
      }
      
      // Check for chemistry shorthand (chem: prefix)
      if (content.startsWith('chem:')) {
        const chemContent = content.slice(5).trim()
        return <ChemistryFormula>{chemContent}</ChemistryFormula>
      }

      return (
        <span
          className={cn(
            "bg-primary-foreground rounded-sm px-1 font-mono text-sm",
            className
          )}
          {...props}
        >
          {children}
        </span>
      )
    }

    const language = extractLanguage(className)
    
    // Handle math and chemistry code blocks
    if (language === 'math' || language === 'latex') {
      return <DisplayMath className="my-4">{children as string}</DisplayMath>
    }
    
    if (language === 'chemistry' || language === 'chem') {
      return <DisplayChemistry className="my-4">{children as string}</DisplayChemistry>
    }

    return (
      <CodeBlock className={className}>
        <CodeBlockGroup className="flex h-9 items-center justify-between px-4">
          <div className="text-muted-foreground py-1 pr-2 font-mono text-xs">
            {language}
          </div>
        </CodeBlockGroup>
        <div className="sticky top-16 lg:top-0">
          <div className="absolute right-0 bottom-0 flex h-9 items-center pr-1.5">
            <ButtonCopy code={children as string} />
          </div>
        </div>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    )
  },
  // Handle math blocks
  div: function DivComponent({ className, children, ...props }) {
    if (className === 'math math-display') {
      return <DisplayMath className="my-4">{children as string}</DisplayMath>
    }
    return <div className={className} {...props}>{children}</div>
  },
  // Handle inline math
  span: function SpanComponent({ className, children, ...props }) {
    if (className === 'math math-inline') {
      return <InlineMath>{children as string}</InlineMath>
    }
    return <span className={className} {...props}>{children}</span>
  },
  a: function AComponent({ href, children, ...props }) {
    if (!href) return <span {...props}>{children}</span>

    return (
      <LinkMarkdown href={href} {...props}>
        {children}
      </LinkMarkdown>
    )
  },
  pre: function PreComponent({ children }) {
    return <>{children}</>
  },
}

const MemoizedMarkdownBlock = memo(
  function MarkdownBlock({
    content,
    components = INITIAL_COMPONENTS,
  }: {
    content: string
    components?: Partial<Components>
  }) {
    // Process LaTeX and chemistry delimiters in content
    const processedContent = content
      // Handle display math with $$ delimiters
      .replace(/\$\$([\s\S]*?)\$\$/g, '```math\n$1\n```')
      // Handle chemistry formulas with chem: prefix (more permissive)
      .replace(/chem:\s*([A-Za-z0-9\+\-\>\<\(\)\s]+)/g, '```chemistry\n$1\n```')

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    )
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content
  }
)

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock"

function MarkdownComponent({
  children,
  id,
  className,
  components = INITIAL_COMPONENTS,
}: MarkdownProps) {
  const generatedId = useId()
  const blockId = id ?? generatedId
  const blocks = useMemo(() => parseMarkdownIntoBlocks(children), [children])

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock
          key={`${blockId}-block-${index}`}
          content={block}
          components={components}
        />
      ))}
    </div>
  )
}

const Markdown = memo(MarkdownComponent)
Markdown.displayName = "Markdown"

export { Markdown }
