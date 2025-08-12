import { useState } from "react"
import { FileUpload } from "../ui/file-upload"

export function FileUploadExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    console.log('Arquivo selecionado:', file?.name)
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Upload de Arquivo</h2>
      
      <FileUpload
        onFileSelect={handleFileSelect}
        testId="upload-area-proposta_pdf"
        maxSize={10 * 1024 * 1024}
        className="w-full"
      />

      {selectedFile && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 mb-2">Arquivo selecionado:</h3>
          <p className="text-sm text-green-700">
            <strong>Nome:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-green-700">
            <strong>Tamanho:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm text-green-700">
            <strong>Tipo:</strong> {selectedFile.type}
          </p>
        </div>
      )}
    </div>
  )
}