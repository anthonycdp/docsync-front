import * as React from "react"
import { Upload, Check, FileText, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/src-next/lib/utils"

interface FileUploadProps {
  accept?: string
  onFileSelect?: (file: File | null) => void
  maxSize?: number
  className?: string
  testId?: string
  disabled?: boolean
}

interface UploadedFile {
  file: File
  name: string
  size: string
}

export function FileUpload({ 
  accept = "application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png",
  onFileSelect,
  maxSize = 10 * 1024 * 1024,
  className,
  testId,
  disabled = false
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.size <= maxSize) {
      const uploadedFileData = {
        file,
        name: file.name,
        size: formatFileSize(file.size)
      }
      setUploadedFile(uploadedFileData)
      onFileSelect?.(file)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const files = e.dataTransfer.files
    const file = files?.[0]
    if (file && file.size <= maxSize) {
      const uploadedFileData = {
        file,
        name: file.name,
        size: formatFileSize(file.size)
      }
      setUploadedFile(uploadedFileData)
      onFileSelect?.(file)
    }
  }

  return (
    <div
      role="presentation"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden group min-h-[280px] max-h-[280px] flex flex-col justify-center",
        uploadedFile 
          ? "border-green-300 bg-green-50/30" 
          : isDragOver 
            ? "border-blue-400 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={testId}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <input
        ref={fileInputRef}
        accept={accept}
        tabIndex={-1}
        type="file"
        onChange={handleFileChange}
        className="sr-only"
        disabled={disabled}
      />

      <div className="relative z-10">
        {uploadedFile ? (
          <div className="space-y-3 flex flex-col justify-center h-full">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-base font-medium text-green-700 mb-2">
                Arquivo carregado com sucesso!
              </p>
              <div className="bg-white p-3 rounded-lg border border-green-200 max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{uploadedFile.size}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
                data-testid="remove-file-button"
              >
                <X className="w-4 h-4 mr-1" />
                Remover e selecionar outro
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={cn(
              "w-12 h-12 mx-auto mb-4 p-3 rounded-xl transition-all duration-300 shadow-sm",
              isDragOver ? "bg-blue-50" : "bg-gray-100 group-hover:bg-blue-50"
            )}>
              <Upload className={cn(
                "w-full h-full transition-colors duration-300",
                isDragOver ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
              )} />
            </div>
            <p className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
              📁 {isDragOver ? "Solte o arquivo aqui" : "Adicione mais arquivos ou clique para selecionar"}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-xs text-gray-600 font-medium group-hover:text-blue-700 transition-colors">
                Arquivo único • PDF, JPG, PNG (máx. {Math.round(maxSize / (1024 * 1024))}MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}