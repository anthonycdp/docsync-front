import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Upload, Check, FileText, ChevronLeft, ChevronRight, AlertTriangle, Loader2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { usePageScroll } from '../hooks/use-scroll-to-focus'

const WIZARD_STEP_CONFIGS = {
  cessao_credito: [
    {
      id: 'proposta_pdf',
      title: 'Selecione a Proposta',
      instruction: 'Faça upload ou selecione o arquivo da proposta de venda.',
      description: 'Documento com informações da proposta comercial',
      acceptsMultiple: false
    },
    {
      id: 'cnh_terceiro', 
      title: 'Selecione a CNH',
      instruction: 'Faça upload ou selecione o arquivo da CNH do terceiro responsável.',
      description: 'Carteira Nacional de Habilitação do terceiro',
      acceptsMultiple: false
    },
    {
      id: 'comprovante_endereco',
      title: 'Selecione o Comprovante de Endereço do Terceiro',
      instruction: 'Faça upload ou selecione o arquivo de comprovante de endereço do terceiro.',
      description: 'Documento que comprove o endereço residencial do terceiro',
      acceptsMultiple: false
    }
  ],
  pagamento_terceiro: [
    {
      id: 'proposta_pdf',
      title: 'Selecione a Proposta',
      instruction: 'Faça upload ou selecione o arquivo da proposta de venda.',
      description: 'Documento com informações da proposta comercial',
      acceptsMultiple: false
    },
    {
      id: 'cnh_terceiro', 
      title: 'Selecione a CNH',
      instruction: 'Faça upload ou selecione o arquivo da CNH do terceiro responsável.',
      description: 'Carteira Nacional de Habilitação do terceiro',
      acceptsMultiple: false
    },
    {
      id: 'comprovante_pagamento',
      title: 'Selecione o Comprovante de Pagamento',
      instruction: 'Faça upload ou selecione o arquivo de comprovante de pagamento.',
      description: 'Documento que comprove o pagamento realizado',
      acceptsMultiple: false
    }
  ],
  declaracao_pagamento_terceiro: [
    {
      id: 'proposta_pdf',
      title: 'Selecione a Proposta',
      instruction: 'Faça upload ou selecione o arquivo da proposta de venda.',
      description: 'Documento com informações da proposta comercial',
      acceptsMultiple: false
    },
    {
      id: 'cnh_terceiro', 
      title: 'Selecione a CNH',
      instruction: 'Faça upload ou selecione o arquivo da CNH do terceiro responsável.',
      description: 'Carteira Nacional de Habilitação do terceiro',
      acceptsMultiple: false
    },
    {
      id: 'comprovante_pagamento',
      title: 'Selecione o Comprovante de Pagamento',
      instruction: 'Faça upload ou selecione o arquivo de comprovante de pagamento.',
      description: 'Documento que comprove o pagamento realizado',
      acceptsMultiple: false
    }
  ]
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
}

function FileWizard({ template, onFilesUploaded, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragStates, setDragStates] = useState({})

  // CKDEV-NOTE: Ref para o elemento de foco principal (área de drag-and-drop)
  const uploadAreaRef = useRef(null)
  
  // CKDEV-NOTE: Trigger scroll ao montar componente ou mudar de step
  const [scrollTrigger, setScrollTrigger] = useState(true)
  
  // CKDEV-NOTE: Scroll automático para a área de upload quando step muda
  usePageScroll(uploadAreaRef, scrollTrigger)
  
  // CKDEV-NOTE: Ativar scroll quando step muda ou componente monta
  useEffect(() => {
    setScrollTrigger(prev => !prev)
    
    // CKDEV-NOTE: Aguardar renderização completa antes de fazer scroll
    const timer = setTimeout(() => {
      if (uploadAreaRef.current) {
        const element = uploadAreaRef.current
        const rect = element.getBoundingClientRect()
        const elementTopFromViewport = rect.top
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        const currentScrollY = window.scrollY
        
        const elementCenterY = elementTopFromViewport + currentScrollY + (elementHeight / 2)
        const viewportCenterY = windowHeight / 2
        const scrollPosition = elementCenterY - viewportCenterY
        
        window.scrollTo({
          top: Math.max(0, scrollPosition - 50), 
          behavior: 'smooth'
        })
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [currentStep])
  
  // CKDEV-NOTE: Scroll inicial quando componente monta
  useEffect(() => {
    const initialScrollTimer = setTimeout(() => {
      if (uploadAreaRef.current) {
        const element = uploadAreaRef.current
        const rect = element.getBoundingClientRect()
        const elementTopFromViewport = rect.top
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        const currentScrollY = window.scrollY
        
        const elementCenterY = elementTopFromViewport + currentScrollY + (elementHeight / 2)
        const viewportCenterY = windowHeight / 2
        const scrollPosition = elementCenterY - viewportCenterY
        
        window.scrollTo({
          top: Math.max(0, scrollPosition - 100), 
          behavior: 'smooth'
        })
      }
    }, 500)
    
    return () => clearTimeout(initialScrollTimer)
  }, [])


  const WIZARD_STEPS = WIZARD_STEP_CONFIGS[template.id] || WIZARD_STEP_CONFIGS.cessao_credito
  const currentStepData = WIZARD_STEPS[currentStep]
  const isLastStep = currentStep === WIZARD_STEPS.length - 1
  const isFirstStep = currentStep === 0
  const hasFileForCurrentStep = uploadedFiles[currentStepData.id]
  const allStepsComplete = WIZARD_STEPS.every(step => uploadedFiles[step.id])

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setDragStates(prev => ({ ...prev, [currentStepData.id]: false }))
    
    if (fileRejections.length > 0) {
      const rejectedFile = fileRejections[0]
      if (rejectedFile.errors.some(error => error.code === 'file-invalid-type')) {
        alert('Apenas arquivos PDF, JPG e PNG são aceitos. Por favor, selecione um arquivo válido.')
        return
      }
      if (rejectedFile.errors.some(error => error.code === 'file-too-large')) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 10MB.')
        return
      }
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setUploadedFiles(prev => ({
        ...prev,
        [currentStepData.id]: file
      }))
    }
  }, [currentStepData.id])

  const onDragEnter = useCallback(() => {
    setDragStates(prev => ({ ...prev, [currentStepData.id]: true }))
  }, [currentStepData.id])

  const onDragLeave = useCallback(() => {
    setDragStates(prev => ({ ...prev, [currentStepData.id]: false }))
  }, [currentStepData.id])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleNextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFiles(prev => {
      const updated = { ...prev }
      delete updated[currentStepData.id]
      return updated
    })
  }

  const handleFinish = async () => {
    if (!allStepsComplete) {
      alert('Por favor, complete todas as etapas antes de finalizar.')
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

  const getProgressPercentage = () => {
    const completedSteps = WIZARD_STEPS.filter(step => uploadedFiles[step.id]).length
    const baseProgress = (completedSteps / WIZARD_STEPS.length) * 100
    return Math.round(baseProgress)
  }

  return (
    <div className="min-h-[600px] flex flex-col" data-testid="file-wizard">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm flex-1 flex flex-col">
        {/* Header with Progress */}
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Upload className="w-5 h-5 text-blue-600" />
              <span>Assistente de Upload de Documentos</span>
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Etapa {currentStep + 1} de {WIZARD_STEPS.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Steps Indicators */}
          <div className="flex items-center justify-between mt-4">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  index < currentStep || uploadedFiles[step.id] ? 'bg-green-600 text-white' : 
                  index === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                )}>
                  {uploadedFiles[step.id] ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={cn(
                    "w-10 h-1 mx-2 transition-all",
                    index < currentStep || uploadedFiles[step.id] ? 'bg-green-600' : 'bg-gray-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        {/* Main Content Area - Fixed Height */}
        <CardContent className="flex-1 flex flex-col min-h-0 p-6">
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                {/* Current Step Info */}
                <div className="text-center mb-4 flex-shrink-0">
                  <h2 
                    className="text-xl font-bold text-gray-900 mb-1"
                  >
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-600 text-base mb-1">
                    {currentStepData.instruction}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Upload Area - Fixed Height */}
                <div className="flex-1 min-h-0 flex flex-col">
                  <div
                    ref={uploadAreaRef}
                    tabIndex={0}
                    {...getRootProps()}
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden group",
                      "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                      "flex-1 flex flex-col justify-center min-h-[280px] max-h-[280px]",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      isDragActive && "border-blue-500 bg-blue-50 scale-105",
                      isDragAccept && "border-green-500 bg-green-50",
                      isDragReject && "border-red-500 bg-red-50"
                    )}
                    data-testid={`upload-area-${currentStepData.id}`}
                  >
                    {/* Gradient Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <input {...getInputProps()} />
                    
                    {hasFileForCurrentStep ? (
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
                                  {uploadedFiles[currentStepData.id].name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(uploadedFiles[currentStepData.id].size)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFile()
                            }}
                            className="mt-2"
                            data-testid="remove-file-button"
                          >
                            Remover e selecionar outro
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col justify-center h-full relative z-10">
                        <div className="w-12 h-12 mx-auto mb-4 p-3 rounded-xl transition-all duration-300 bg-gray-100 group-hover:bg-blue-50 shadow-sm">
                          <Upload className={cn(
                            "w-full h-full transition-colors duration-300 text-gray-500 group-hover:text-blue-600",
                            isDragAccept && "text-green-500",
                            isDragReject && "text-red-500"
                          )} />
                        </div>
                        {isDragActive ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                          >
                            <p className={cn(
                              "text-base font-medium mb-2",
                              isDragAccept ? "text-green-700" : "text-red-700"
                            )}>
                              {isDragAccept ? 'Solte o arquivo aqui!' : 'Apenas arquivos PDF, JPG e PNG são aceitos'}
                            </p>
                          </motion.div>
                        ) : (
                          <>
                            <p className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                              📁 Adicione mais arquivos ou clique para selecionar
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                              <p className="text-xs text-gray-600 font-medium group-hover:text-blue-700 transition-colors">
                                Arquivo único • PDF, JPG, PNG (máx. 10MB)
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* File Format Notice */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mt-4 flex-shrink-0">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1 text-sm">Importante</h4>
                      <p className="text-xs text-blue-800">
                        O sistema aceita arquivos em formato PDF, JPG e PNG. 
                        Certifique-se de que o documento esteja legível e completo.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed Navigation Buttons - Always at bottom */}
          <div className="flex justify-between pt-4 border-t mt-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={isFirstStep ? onCancel : handlePreviousStep}
              className="text-gray-600 hover:text-gray-900"
              disabled={isProcessing}
              data-testid="previous-button"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>{isFirstStep ? 'Cancelar' : 'Anterior'}</span>
            </Button>

            {isLastStep ? (
              <Button
                size="sm"
                onClick={handleFinish}
                disabled={!allStepsComplete || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                data-testid="finish-button"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>Finalizar</span>
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleNextStep}
                disabled={!hasFileForCurrentStep || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                data-testid="next-button"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Step Summary - Compact */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex-shrink-0">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Resumo dos Documentos:</h4>
            <div className="space-y-1">
              {WIZARD_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={uploadedFiles[step.id] ? "default" : "outline"}
                      className={cn(
                        "text-xs",
                        uploadedFiles[step.id] ? 
                          "text-green-700 border-green-300 bg-green-100" : 
                          "text-gray-500 border-gray-300"
                      )}
                    >
                      {step.title}
                    </Badge>
                  </div>
                  {uploadedFiles[step.id] ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-3 h-3" />
                      <span className="text-xs">Carregado</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Pendente</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FileWizard