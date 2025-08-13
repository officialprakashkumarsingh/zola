import { useState, useCallback } from 'react'

export type FileProcessingStatus = {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  error?: string
}

export type FileProcessingState = {
  [fileName: string]: FileProcessingStatus
}

export function useFileProcessing() {
  const [processingState, setProcessingState] = useState<FileProcessingState>({})

  const setFileStatus = useCallback((fileName: string, status: FileProcessingStatus) => {
    setProcessingState(prev => ({
      ...prev,
      [fileName]: status
    }))
  }, [])

  const removeFile = useCallback((fileName: string) => {
    setProcessingState(prev => {
      const newState = { ...prev }
      delete newState[fileName]
      return newState
    })
  }, [])

  const clearAll = useCallback(() => {
    setProcessingState({})
  }, [])

  const getFileStatus = useCallback((fileName: string): FileProcessingStatus => {
    return processingState[fileName] || { status: 'pending' }
  }, [processingState])

  return {
    processingState,
    setFileStatus,
    removeFile,
    clearAll,
    getFileStatus
  }
}