"use client"

import { Markdown } from "@/components/prompt-kit/markdown"

const exampleContent = `# LaTeX and Chemistry Formula Support

## LaTeX Math Examples

### Inline Math
Here's an inline formula: $E = mc^2$ and another one: $\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$

### Display Math
$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

### Complex Equations
$$
\\begin{align}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &= \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} &= 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &= \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} &= 0
\\end{align}
$$

## Chemistry Formula Examples

### Simple Molecules
- Water: chem:H2O
- Carbon dioxide: chem:CO2
- Methane: chem:CH4
- Sulfuric acid: chem:H2SO4

### Chemical Reactions
\`\`\`chemistry
2H2 + O2 -> 2H2O
\`\`\`

\`\`\`chemistry
CaCO3 -> CaO + CO2
\`\`\`

\`\`\`chemistry
CH4 + 2O2 -> CO2 + 2H2O
\`\`\`

### Complex Molecules
\`\`\`chemistry
C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP
\`\`\`

### Ionic Equations
\`\`\`chemistry
AgNO3 + NaCl -> AgCl v + NaNO3
\`\`\`

## Usage Guide

### For LaTeX Math:
- Inline math: \`$formula$\` 
- Display math: \`$$formula$$\`
- Code blocks: \`\`\`math or \`\`\`latex

### For Chemistry:
- Inline formulas: \`chem:H2O\`
- Code blocks: \`\`\`chemistry or \`\`\`chem
- Direct LaTeX: \`\\ce{H2O}\`

Try asking the AI about mathematical concepts or chemical reactions to see these formulas in action!`

export function FormulaExamples() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Markdown className="prose prose-sm max-w-none dark:prose-invert">
        {exampleContent}
      </Markdown>
    </div>
  )
}