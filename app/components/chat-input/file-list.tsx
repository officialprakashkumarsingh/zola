import { AnimatePresence, motion } from "motion/react"
import { FileItemDisplay } from "../../../components/chat-input/file-item-display"

type FileListProps = {
  files: File[]
  onFileRemove: (file: File) => void
}

const TRANSITION = {
  type: "spring",
  duration: 0.2,
  bounce: 0,
}

export function FileList({ files, onFileRemove }: FileListProps) {
  return (
    <AnimatePresence initial={false}>
      {files.length > 0 && (
        <motion.div
          key="files-list"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={TRANSITION}
          className="overflow-hidden"
        >
          <div className="space-y-2 p-3">
            <AnimatePresence initial={false}>
              {files.map((file) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={TRANSITION}
                >
                  <FileItemDisplay
                    file={file}
                    onRemove={() => onFileRemove(file)}
                    extractionStatus="ready"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
