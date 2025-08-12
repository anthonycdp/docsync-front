import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { FileText, Upload, Car, CreditCard, Scale, Sparkles, ArrowLeft, AlertTriangle, HelpCircle } from "lucide-react"
import TemplateFileUploader from "./TemplateFileUploader"
import DownloadPage from "./DownloadPage"
import ProcessingStatus from "./ProcessingStatus"
import ProgressStepper from "./ProgressStepper"
import PreviewStep from "./PreviewStep"
import BackToHomeButton from "./BackToHomeButton"
import Footer from "./Footer"

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processedData, setProcessedData] = useState(null)
  const [currentView, setCurrentView] = useState('templates')
  const [validationResults, setValidationResults] = useState(null)
  const [isGeneratingDocuments, setIsGeneratingDocuments] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  
  useEffect(() => {
    // CKDEV-NOTE: Modo de teste removido - apenas dados reais dos PDFs serão utilizados
  }, [])

  const mockTemplates = [
    {
      id: 'responsabilidade_veiculo',
              name: 'Termo de Responsabilidade - Veículos Usados',
        description: 'Documento de responsabilidade sobre veículo usado'
    },
    {
      id: 'pagamento_terceiro', 
      name: 'Declaração de Pagamento a Terceiro',
      description: 'Declaração de pagamento realizado em favor de terceiro'
    },
    {
      id: 'cessao_credito',
      name: 'Cessão de Crédito',
      description: 'Termo de transferência de crédito entre partes'
    }
  ]





  const templates = mockTemplates.map(template => ({
    ...template,
    description: template.id === 'responsabilidade_veiculo' ? 'Documento de responsabilidade sobre veículo usado' :
                template.id === 'pagamento_terceiro' ? 'Declaração de pagamento realizado em favor de terceiro' :
                template.id === 'cessao_credito' ? 'Termo de transferência de crédito entre partes' :
                'Documento jurídico automatizado',
    requiredDocuments: template.id === 'responsabilidade_veiculo' ? ['Proposta PDF'] :
                      template.id === 'pagamento_terceiro' ? ['Proposta PDF', 'CNH Terceiro', 'Comprovante Pagamento'] :
                      template.id === 'cessao_credito' ? ['Proposta PDF', 'CNH Terceiro', 'Comprovante de endereço do terceiro'] :
                      ['Documentos'],
    acceptedFileTypes: ['PDF', 'JPG', 'PNG']
  }))

  const getTemplateIcon = (templateId) => {
    switch (templateId) {
      case 'pagamento_terceiro': return CreditCard
      case 'cessao_credito': return Scale
      case 'responsabilidade_veiculo': return Car
      default: return FileText
    }
  }

  const handleFilesUpload = async (uploadData) => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setCurrentView('processing')
    
    // CKDEV-NOTE: Declare progressInterval outside try block to avoid ReferenceError in catch
    let progressInterval = null
    
    try {
      progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 500)

      const formData = new FormData()
      formData.append('template', uploadData.templateId)
      
      Object.values(uploadData.files).forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('http://127.0.0.1:5000/api/documents/process', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (result.success) {
        clearInterval(progressInterval)
        setProcessingProgress(100)
        
        setTimeout(() => {
          const backendData = result.data || result
          
          setProcessedData({
            success: true,
            session_id: backendData.session_id,
            template_type: backendData.template_type,
            extracted_data: backendData.extracted_data,
            validation_results: backendData.validation_results
          })

          setExtractedData(backendData.extracted_data || {})
          setValidationResults(backendData.validation_results || {})
          setCurrentView('review')
          setIsProcessing(false)
        }, 1000)
      } else {
        throw new Error(result.message || 'Processing failed')
      }
      
    } catch (error) {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      
      alert(`Erro ao processar documentos: ${error.message}\n\nPor favor, tente novamente.`)
      
      setCurrentView('upload')
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }



  const handleBackToUpload = () => {
    setCurrentView('upload')
    setProcessedData(null)
    setExtractedData(null)
    setValidationResults(null)
    setProcessingProgress(0)
  }

  const handleBackToProcessing = () => {
    setCurrentView('processing')
  }

  const handleBackToHome = () => {
    setCurrentView('templates')
    setSelectedTemplate(null)
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessedData(null)
    setValidationResults(null)
    setIsGeneratingDocuments(false)
    setExtractedData(null)
  }

  const handleDataCorrected = (correctedData, updatedValidationResults) => {
    setExtractedData(correctedData)
    setValidationResults(updatedValidationResults)
  }

  const handleGenerateDocuments = async () => {
    setIsGeneratingDocuments(true)
    
    try {
      const sessionId = processedData?.session_id
      
      if (!sessionId) {
        throw new Error('Session ID não encontrado nos dados processados')
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      try {
        const requestBody = {
          format_type: 'docx',
          template_type: processedData?.template_type || 'responsabilidade_veiculo'
        }
        
        const response = await fetch(`http://127.0.0.1:5000/api/documents/generate/${sessionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro na API de geração (${response.status}): ${errorText}`)
      }

      const result = await response.json()
      
      if (result.success && result.data?.download_url) {
        const updatedData = {
          ...processedData,
          ...result.data,
          extractedData,
          validationResults,
          download_url: result.data.download_url,
          formats_available: result.data.formats_available || ['docx']
        }
        
        setProcessedData(updatedData)
        setCurrentView('download')
      } else {
        throw new Error(result.error || result.message || 'Falha na geração do documento - resposta inválida')
      }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Timeout: A geração do documento demorou mais que 30 segundos')
        }
        throw fetchError
      }
    } catch (error) {
      let userMessage = 'Erro ao gerar documentos: '
      
      if (error.message.includes('fetch')) {
        userMessage += 'Não foi possível conectar com o servidor. Verifique se o backend está rodando.'
      } else if (error.message.includes('Session ID')) {
        userMessage += 'Dados da sessão perdidos. Tente reprocessar os arquivos.'
      } else {
        userMessage += error.message
      }
      
      alert(userMessage)
      
      const goBack = window.confirm(userMessage + '\n\nDeseja voltar para o processamento?')
      if (goBack) {
        setCurrentView('processing')
      }
    } finally {
      setIsGeneratingDocuments(false)
    }
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setCurrentView('upload')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-blue-50/30 to-white shadow-xl border-b border-blue-100/50 backdrop-blur-md flex-shrink-0">
        <div className="max-w-app-container 2xl:max-w-app-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo and Brand Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="relative group">
                {/* Main icon container */}
                <div className="h-14 w-14 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 h-14 w-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300 -z-10" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-gray-800 bg-clip-text text-transparent">
                  DocSync
                </h1>
                <p className="text-sm font-medium text-gray-600">
                  Sistema de Automação Documental
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/60 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">Sistema Online</span>
              </div>
            </div>
          </div>
          
          {/* Progress Stepper */}
          <ProgressStepper 
            currentStep={
              currentView === 'templates' ? 'upload' :
              currentView === 'upload' ? 'upload' :
              currentView === 'processing' ? 'processing' :
              currentView === 'review' ? 'review' :
              currentView === 'download' ? 'download' : 'upload'
            } 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-app-container 2xl:max-w-app-container-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 flex-1 flex flex-col w-full mb-16">
        {/* Templates View */}
        {currentView === 'templates' && (
          <>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-6 xl:gap-8 h-full flex-1 min-h-0 w-full">
              {/* Templates Section */}
              <div className="lg:col-span-7 h-full w-full overflow-hidden">
                <Card className="border border-gray-200/80 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-b border-gray-100/80 pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-md">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Termos Jurídicos Original VW
                      </span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm mt-1">
                      Escolha o tipo de documento que deseja automatizar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-4 max-w-full">
                      {templates.map((template, index) => {
                        const IconComponent = getTemplateIcon(template.id)
                        const colors = [
                          { bg: "from-blue-500 to-blue-600", accent: "border-blue-200 hover:border-blue-400", shadow: "hover:shadow-blue-200/25" },
                          { bg: "from-emerald-500 to-emerald-600", accent: "border-emerald-200 hover:border-emerald-400", shadow: "hover:shadow-emerald-200/25" },
                          { bg: "from-purple-500 to-purple-600", accent: "border-purple-200 hover:border-purple-400", shadow: "hover:shadow-purple-200/25" }
                        ]
                        const colorScheme = colors[index % colors.length]
                        
                        return (
                          <Card 
                            key={template.id}
                            className={`group cursor-pointer transition-all duration-300 ${colorScheme.accent} hover:shadow-xl ${colorScheme.shadow} hover:-translate-y-1 bg-white/80 backdrop-blur-sm relative overflow-hidden`}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            {/* Subtle background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50/50 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" />
                            
                            <CardContent className="p-4 relative">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorScheme.bg} text-white shadow-md group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}>
                                  <IconComponent className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-base group-hover:text-gray-800 transition-colors">
                                      {template.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed group-hover:text-gray-700 transition-colors">
                                      {template.description}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-xs font-medium text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-full">
                                        Aceita:
                                      </span>
                                      {template.acceptedFileTypes.map((type) => (
                                        <Badge 
                                          key={type} 
                                          variant="outline" 
                                          className="text-xs px-2 py-0.5 bg-green-50/80 text-green-700 border-green-200"
                                        >
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-xs font-medium text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-full">
                                        Requer:
                                      </span>
                                      {template.requiredDocuments.map((doc) => (
                                        <Badge 
                                          key={doc} 
                                          variant="outline" 
                                          className="text-xs px-2 py-0.5 bg-orange-50/80 text-orange-700 border-orange-200"
                                        >
                                          {doc}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Hover indicator */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ArrowLeft className="w-3 h-3 text-gray-600 rotate-180" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Help Sidebar */}
              <div className="lg:col-span-3 space-y-3 h-full flex flex-col lg:sticky lg:top-4 w-full">
                <Card className="border border-blue-200/60 shadow-xl bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-md">
                        <HelpCircle className="w-3 h-3" />
                      </div>
                      <span className="text-gray-800">Guia Rápido</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-4 pb-4">
                    <div className="space-y-3">
                      {[
                        { step: 1, title: "Escolha o Template", desc: "Selecione o tipo de documento jurídico", color: "from-blue-500 to-blue-600" },
                        { step: 2, title: "Envie os Arquivos", desc: "Faça upload dos documentos necessários", color: "from-emerald-500 to-emerald-600" },
                        { step: 3, title: "Revise os Dados", desc: "Valide as informações extraídas", color: "from-orange-500 to-orange-600" },
                        { step: 4, title: "Baixe o Documento", desc: "Documento preenchido automaticamente", color: "from-purple-500 to-purple-600" }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3 p-2 rounded-lg">
                          <div className={`w-6 h-6 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md`}>
                            {item.step}
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <p className="text-xs font-semibold text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick Tips */}
                    <div className="pt-3 border-t border-gray-200/60">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700">Dicas Rápidas</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          • Aceita PDF, DOCX e imagens
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          • Processamento automático de dados
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          • Suporte a múltiplos documentos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Upload View */}
        {currentView === 'upload' && selectedTemplate && (
          <div className="flex flex-col w-full mb-20">
            <div className="flex-shrink-0 mb-4">
              <BackToHomeButton onBackToHome={handleBackToHome} />
            </div>

            {/* Template Badge */}
            <div className="flex-shrink-0 mb-6">
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-lg font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 shadow-lg px-6 py-3">
                  📄 {selectedTemplate.name}
                </Badge>
              </div>
            </div>

            <div className="flex-1">
              <TemplateFileUploader 
                template={selectedTemplate}
                onFilesUploaded={handleFilesUpload}
                onCancel={handleBackToHome}
              />
            </div>
          </div>
        )}

        {/* Processing View */}
        {currentView === 'processing' && (
          <div className="w-full">
            <ProcessingStatus 
              progress={processingProgress}
              isProcessing={isProcessing}
              templateName={selectedTemplate?.name}
              onCancel={() => {
                setCurrentView('upload')
                setIsProcessing(false)
                setProcessingProgress(0)
              }}
              onGoBack={() => setCurrentView('upload')}
              onBackToHome={handleBackToHome}
            />
          </div>
        )}

        {/* Review View */}
        {currentView === 'review' && (
          <div className="flex-1 flex flex-col">
            <PreviewStep
              sessionId={processedData?.session_id}
              onDataCorrected={handleDataCorrected}
              onGenerateDocuments={handleGenerateDocuments}
              isGenerating={isGeneratingDocuments}
              onBack={handleBackToProcessing}
              onBackToHome={handleBackToHome}
            />
          </div>
        )}

        {/* Download View */}
        {currentView === 'download' && (
          processedData && processedData.download_url ? (
            <DownloadPage
              processedData={processedData}
              onBackToUpload={handleBackToUpload}
              templateName={selectedTemplate?.name}
              onBackToHome={handleBackToHome}
            />
          ) : (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center max-w-md p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro nos Dados de Download</h2>
                <p className="text-gray-600 mb-4">
                  Os dados necessários para a página de download não foram carregados corretamente.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setCurrentView('review')}
                    className="w-full"
                  >
                    Voltar para Revisão
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleBackToUpload}
                    className="w-full"
                  >
                    Reiniciar Processo
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}