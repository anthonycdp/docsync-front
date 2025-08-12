import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Upload, X, FileText, Image, Check, AlertTriangle, ArrowLeft } from 'lucide-react'
import FileTypeSelector from './FileTypeSelector'
import FileWizard from './FileWizard'
import { usePageScroll } from '../hooks/use-scroll-to-focus'

const TEMPLATE_CONFIG = {
  // Termo de Responsabilidade - Veículos Usados
  responsabilidade_veiculo: {
    name: 'Termo de Responsabilidade - Veículos Usados',
    description: 'Documento de responsabilidade sobre veículo usado',
    requiredFiles: ['proposta_pdf'],
    requiredLabels: {
      proposta_pdf: 'Proposta PDF (Documento da Proposta)'
    },
    acceptedTypes: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  },
  // Declaração de Pagamento por Conta e Ordem de Terceiro
  pagamento_terceiro: {
    name: 'Declaração de Pagamento por Conta e Ordem de Terceiro',
    description: 'Declaração de pagamento realizado em favor de terceiro',
    requiredFiles: ['proposta_pdf', 'cnh_terceiro', 'comprovante_pagamento'],
    requiredLabels: {
      proposta_pdf: 'Proposta PDF (Documento da Proposta)',
      cnh_terceiro: 'CNH do Terceiro (Carteira Nacional de Habilitação)',
      comprovante_pagamento: 'Comprovante de Pagamento'
    },
    acceptedTypes: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 3
  },
  // Declaração de Pagamento a Terceiro
  declaracao_pagamento_terceiro: {
    name: 'Declaração de Pagamento a Terceiro',
    description: 'Declaração de pagamento direto para terceiro',
    requiredFiles: ['proposta_pdf', 'cnh_terceiro', 'comprovante_pagamento'],
    requiredLabels: {
      proposta_pdf: 'Proposta PDF (Documento da Proposta)',
      cnh_terceiro: 'CNH do Terceiro (Carteira Nacional de Habilitação)',
      comprovante_pagamento: 'Comprovante de Pagamento'
    },
    acceptedTypes: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 3
  },
  // Termo de Dação-Crédito em Favor de Terceiros
  cessao_credito: {
    name: 'Termo de Dação-Crédito em Favor de Terceiros',
    description: 'Termo de transferência de crédito entre partes',
    requiredFiles: ['proposta_pdf', 'cnh_terceiro', 'comprovante_endereco'],
    requiredLabels: {
      proposta_pdf: 'Proposta PDF (Documento da Proposta)',
      cnh_terceiro: 'CNH do Terceiro (Carteira Nacional de Habilitação)',
      comprovante_endereco: 'Comprovante de endereço do terceiro'
    },
    acceptedTypes: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 3
  }
}

function TemplateFileUploader({ template, onFilesUploaded, onCancel }) {
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFileTypeSelector, setShowFileTypeSelector] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  
  // CKDEV-NOTE: Ref para o elemento de foco principal (área de upload)
  const uploadAreaRef = useRef(null)
  
  // CKDEV-NOTE: Scroll inteligente que centraliza a área de upload
  usePageScroll(uploadAreaRef, 'upload')
  
  const templateConfig = TEMPLATE_CONFIG[template.id] || TEMPLATE_CONFIG.pagamento_terceiro

  if (template.id === 'cessao_credito' || template.id === 'pagamento_terceiro') {
    return (
      <FileWizard
        template={template}
        onFilesUploaded={onFilesUploaded}
        onCancel={onCancel}
      />
    )
  }
  
  const onDrop = useCallback((acceptedFiles, fileRejections, event) => {
    setIsDragOver(false)
    if (acceptedFiles.length === 0) return
    
    if (templateConfig.requiredFiles.length > 1) {
      setPendingFiles(acceptedFiles)
      setShowFileTypeSelector(true)
    } else {
      // Single file type - assign directly
      const fileType = templateConfig.requiredFiles[0]
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: acceptedFiles[0]
      }))
    }
  }, [templateConfig])

  const onDragEnter = useCallback(() => setIsDragOver(true), [])
  const onDragLeave = useCallback(() => setIsDragOver(false), [])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: templateConfig.acceptedTypes,
    maxFiles: templateConfig.maxFiles,
    multiple: templateConfig.maxFiles > 1,
    noClick: false
  })

  const handleFileTypeSelectorComplete = (categorizedFiles) => {
    setUploadedFiles(prev => ({ ...prev, ...categorizedFiles }))
    setShowFileTypeSelector(false)
    setPendingFiles([])
  }

  const addMoreFiles = () => {
    open()
  }

  const handleFileTypeSelectorCancel = () => {
    setShowFileTypeSelector(false)
    setPendingFiles([])
  }

  const removeFile = (fileType) => {
    setUploadedFiles(prev => {
      const updated = { ...prev }
      delete updated[fileType]
      return updated
    })
  }

  const handleProcess = async () => {
    const requiredFilesMissing = templateConfig.requiredFiles.filter(
      type => !uploadedFiles[type]
    )
    
    if (requiredFilesMissing.length > 0) {
      alert(`Faltam os seguintes arquivos: ${requiredFilesMissing.map(type => templateConfig.requiredLabels[type]).join(', ')}`)
      return
    }

    setIsProcessing(true)
    try {
      await onFilesUploaded({
        templateId: template.id,
        files: uploadedFiles
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return FileText
    if (file.type.startsWith('image/')) return Image
    return FileText
  }

  const getDropzoneStyle = () => {
    if (isDragAccept || (isDragOver && !isDragReject)) return 'border-green-500 bg-green-50 scale-105 shadow-lg'
    if (isDragReject) return 'border-red-500 bg-red-50 shake'
    if (isDragActive || isDragOver) return 'border-blue-500 bg-blue-50 scale-102'
    return 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
  }

  const isComplete = templateConfig.requiredFiles.every(type => uploadedFiles[type])
  const uploadedCount = Object.keys(uploadedFiles).length
  const totalRequired = templateConfig.requiredFiles.length

  return (
    <Card className="border-2 border-gray-100/80 shadow-2xl bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/40 via-white to-purple-50/40 border-b border-gray-100/60">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Upload</h3>
              <p className="text-sm text-gray-600 font-normal mt-0.5">{templateConfig.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <div className="p-1.5 bg-emerald-100 rounded-full">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            )}
            <Badge 
              variant={isComplete ? "default" : "secondary"}
              className={`px-3 py-1 text-sm font-semibold ${
                isComplete 
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {uploadedCount}/{totalRequired}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-4 flex flex-col min-h-0">
        {/* Upload Area Container */}
        <div className="flex-1 min-h-0 flex flex-col">
          <motion.div
          ref={uploadAreaRef}
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden group
            ${getDropzoneStyle()}
            flex-1 flex flex-col justify-center min-h-[280px] max-h-[280px]
          `}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          animate={{
            scale: isDragOver ? 1.01 : 1,
            borderWidth: isDragOver ? 3 : 2,
            y: isDragOver ? -2 : 0
          }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <input {...getInputProps()} />
          
          {/* Show uploaded file inside upload area for single file templates */}
          {templateConfig.requiredFiles.length === 1 && uploadedCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 flex flex-col justify-center h-full relative z-10"
            >
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
                      <p className="font-medium text-gray-900 text-sm">
                        {Object.values(uploadedFiles)[0].name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(Object.values(uploadedFiles)[0].size)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setUploadedFiles({})
                  }}
                  className="mt-2"
                  data-testid="remove-file-button"
                >
                  Remover e selecionar outro
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  y: isDragOver ? -3 : 0,
                  rotate: isDragOver ? 3 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-12 h-12 mx-auto mb-4 p-3 rounded-xl transition-all duration-300 ${
                  isDragAccept || isDragOver ? 'bg-emerald-100 shadow-md shadow-emerald-200/50' : 
                  isDragReject ? 'bg-red-100 shadow-md shadow-red-200/50' : 'bg-gray-100 group-hover:bg-blue-50 shadow-sm'
                }`}
              >
                <Upload className={`w-full h-full transition-colors duration-300 ${
                  isDragAccept || isDragOver ? 'text-emerald-600' : 
                  isDragReject ? 'text-red-600' : 'text-gray-500 group-hover:text-blue-600'
                }`} />
              </motion.div>
              
              {isDragActive || isDragOver ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className={`text-lg font-bold ${
                    isDragAccept || (isDragOver && !isDragReject) ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {isDragAccept || (isDragOver && !isDragReject) ? '🎉 Solte os arquivos aqui!' : '⚠️ Alguns arquivos não são aceitos'}
                  </p>
                  {isDragAccept || (isDragOver && !isDragReject) ? (
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-700 font-medium">✓ Arquivos válidos detectados</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700 font-medium">✗ Verifique o tipo e tamanho dos arquivos</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <>
                  <p className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {uploadedCount > 0 ? '📁 Adicione mais arquivos ou clique para selecionar' : '📤 Arraste arquivos aqui ou clique para selecionar'}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <p className="text-xs text-gray-600 font-medium group-hover:text-blue-700 transition-colors">
                      {templateConfig.maxFiles > 1 
                        ? `Até ${templateConfig.maxFiles} arquivos • PDF, JPG, PNG (máx. 10MB cada)`
                        : 'Arquivo único • PDF, JPG, PNG (máx. 10MB)'
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
        </div>

        {/* Required Files Info - Moved to after upload area */}
        <div className="relative p-4 bg-gradient-to-r from-blue-50/60 via-white to-purple-50/60 rounded-xl border-2 border-blue-100/50 backdrop-blur-sm overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-10 translate-x-10" />
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <div className="p-1 bg-blue-600 rounded-lg">
              <FileText className="w-3 h-3 text-white" />
            </div>
            Arquivos Necessários:
          </h4>
          <div className="space-y-2">
            {templateConfig.requiredFiles.map((fileType) => (
              <div key={fileType} className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-100 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={uploadedFiles[fileType] ? "default" : "outline"}
                    className={`px-2 py-1 text-xs font-semibold transition-all duration-200 ${
                      uploadedFiles[fileType] 
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm" 
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {templateConfig.requiredLabels[fileType]}
                  </Badge>
                </div>
                {uploadedFiles[fileType] && (
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <div className="p-0.5 bg-emerald-100 rounded-full">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs font-medium">Enviado</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 bg-blue-100/50 rounded-lg border border-blue-200/50">
            <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
              <div className="w-1 h-1 bg-blue-600 rounded-full" />
              Aceita: PDF, JPG, PNG • Máx. 10MB por arquivo
            </p>
          </div>
        </div>

        {/* Uploaded Files - Only show for multi-file templates */}
        {uploadedCount > 0 && templateConfig.requiredFiles.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <span>Arquivos Enviados</span>
              {isComplete && <Check className="w-4 h-4 text-green-600" />}
            </h4>
            
            <div className="space-y-2">
              {Object.entries(uploadedFiles).map(([fileType, file]) => {
                const FileIcon = getFileIcon(file)
                return (
                  <motion.div
                    key={fileType}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {templateConfig.requiredLabels[fileType]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.name} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(fileType)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons - Show for all templates when files are uploaded */}
        {uploadedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg bg-card text-card-foreground border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Status: <span className="font-medium">{uploadedCount}/{totalRequired} arquivo(s)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-10 px-4 py-2 text-gray-600 hover:text-gray-900"
                    data-testid="back-button"
                    aria-label="Voltar para seleção de templates"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </motion.button>
                  {!isComplete && uploadedCount > 0 && templateConfig.requiredFiles.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addMoreFiles}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-10 px-4 py-2 text-gray-600 hover:text-gray-900"
                      data-testid="add-more-files"
                      aria-label="Adicionar mais arquivos para upload"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Adicionar Mais
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUploadedFiles({})}
                    disabled={isProcessing}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-10 px-4 py-2 text-gray-600 hover:text-gray-900"
                    data-testid="clear-all-files"
                    aria-label="Limpar todos os arquivos enviados"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpar Todos
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProcess}
                    disabled={!isComplete || isProcessing}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                    data-testid="process-documents"
                    aria-label="Processar documentos enviados"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Processar Documentos
                        <Upload className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Completion Status */}
        {!isComplete && uploadedCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              Ainda faltam {totalRequired - uploadedCount} arquivo(s) necessário(s)
            </p>
          </motion.div>
        )}

        {/* File Type Selector Modal */}
        {showFileTypeSelector && (
          <FileTypeSelector
            files={pendingFiles}
            availableTypes={templateConfig.requiredFiles}
            typeLabels={templateConfig.requiredLabels}
            acceptedTypes={templateConfig.acceptedTypes}
            maxFiles={templateConfig.maxFiles}
            onComplete={handleFileTypeSelectorComplete}
            onCancel={handleFileTypeSelectorCancel}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default TemplateFileUploader