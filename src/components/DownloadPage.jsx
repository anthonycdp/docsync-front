import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Download, FileText, FileImage, CheckCircle, RefreshCw, ArrowLeft, Clock, AlertTriangle } from 'lucide-react'
import BackToHomeButton from './BackToHomeButton'
import { usePageScroll } from '../hooks/use-scroll-to-focus'


function DownloadPage({ processedData, onBackToUpload, templateName, onBackToHome }) {
  const [downloadingFile, setDownloadingFile] = useState(null)
  const [downloadedFiles, setDownloadedFiles] = useState([])
  // CKDEV-NOTE: Ref to prevent duplicate downloads when user clicks multiple times quickly
  const downloadInProgressRef = useRef(new Set())
  
  // CKDEV-NOTE: Ref para o elemento de foco principal (cards de download)
  const downloadCardsRef = useRef(null)
  
  // CKDEV-NOTE: Hook para centralizar o foco nos cards de download
  usePageScroll(downloadCardsRef, true)

  const getTemplateDisplayName = (templateId, fallbackName) => {
    const templateNames = {
      'responsabilidade_veiculo': 'Termo de Responsabilidade - Veículos Usados',
      'pagamento_terceiro': 'Declaração de Pagamento por Conta e Ordem de Terceiro',
      'cessao_credito': 'Termo de Declaração de Cessão de Crédito'
    }
    
    if (templateId && templateNames[templateId]) {
      return templateNames[templateId]
    }
    
    if (fallbackName && typeof fallbackName === 'string') {
      return fallbackName.length > 20 ? fallbackName.substring(0, 20) + '...' : fallbackName
    }
    
    return 'Documento'
  }

  // CKDEV-NOTE: Memoize download function to prevent recreation and add duplicate prevention
  const handleDownload = useCallback(async (fileType, downloadUrl, filename) => {
    // CKDEV-NOTE: Prevent duplicate downloads if same file type is already downloading
    const downloadKey = `${fileType}-${filename}`
    if (downloadInProgressRef.current.has(downloadKey)) {
      return // Silent return to avoid multiple downloads
    }
    
    downloadInProgressRef.current.add(downloadKey)
    setDownloadingFile(fileType)
    
    try {
      
      if (!downloadUrl) {
        throw new Error(`URL não disponível para ${fileType}`)
      }

      const response = await fetch(downloadUrl)
      
      if (!response.ok) {
        
        // CKDEV-NOTE: Enhanced error handling for different file types
        if (response.status === 404) {
          if (fileType === 'pdf') {
            setPdfAvailable(false)
            setPdfCheckAttempted(true)
            throw new Error(`Arquivo PDF não foi encontrado no servidor. O sistema pode estar gerando o arquivo ou houve um problema na conversão. Use o arquivo DOCX como alternativa.`)
          } else {
            throw new Error(`Arquivo ${fileType.toUpperCase()} não encontrado no servidor`)
          }
        }
        
        throw new Error(`Erro no servidor: ${response.status} - ${response.statusText}`)
      }
      
      const blob = await response.blob()
      
      // CKDEV-NOTE: Validate blob size for PDFs
      if (fileType === 'pdf' && blob.size < 100) {
        setPdfAvailable(false)
        setPdfCheckAttempted(true)
        throw new Error(`Arquivo PDF corrompido ou muito pequeno (${blob.size} bytes). Use o arquivo DOCX como alternativa.`)
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setDownloadedFiles(prev => [...prev, fileType])
      
      // CKDEV-NOTE: Clean up download state after successful download
      downloadInProgressRef.current.delete(downloadKey)
      setDownloadingFile(null)
    } catch (error) {
      console.error(`Download error for ${fileType}:`, error)
      
      // CKDEV-NOTE: Show user-friendly error messages
      if (fileType === 'pdf') {
        alert(`Erro ao baixar PDF: ${error.message}\n\nRecomendação: Use o arquivo DOCX que está disponível.`)
      } else {
        alert(`Erro ao baixar arquivo ${fileType.toUpperCase()}: ${error.message}`)
      }
    
      downloadInProgressRef.current.delete(downloadKey)
      setDownloadingFile(null)
    }
  }, []) // CKDEV-NOTE: No dependencies needed since we use refs for state that shouldn't cause re-renders

  const getPdfUrl = () => {
    // CKDEV-NOTE: Use the PDF URL provided directly from backend if available
    if (processedData?.pdf_download_url) {
      return processedData.pdf_download_url
    }
    
    // CKDEV-NOTE: Fallback to generating PDF URL from DOCX URL
    const docxUrl = processedData?.download_url
    if (!docxUrl) {
      return null
    }
    
    try {
      let pdfUrl
      
      if (docxUrl.includes('.docx')) {
        pdfUrl = docxUrl.replace('.docx', '.pdf')
      } else if (docxUrl.match(/\.(docx|doc)$/i)) {
        pdfUrl = docxUrl.replace(/\.(docx|doc)$/i, '.pdf')
      } else {
        // If no extension found, try common patterns
        if (docxUrl.includes('processed_')) {
          pdfUrl = docxUrl + '.pdf'
        } else {
          pdfUrl = docxUrl.replace(/([^\/]+)$/, '$1.pdf')
        }
      }
      
      return pdfUrl
      
    } catch (error) {
      return null
    }
  }

  const generateFilename = (extension) => {
    const timestamp = new Date().toISOString().split('T')[0]
    const templateSlug = templateName?.toLowerCase().replace(/\s+/g, '_') || 'documento'
    return `${templateSlug}_${timestamp}.${extension}`
  }

  // CKDEV-NOTE: Use backend filenames when available, fallback to generated names
  const docxFilename = processedData?.output_filename || generateFilename('docx')
  const pdfFilename = processedData?.pdf_filename || generateFilename('pdf')
  const pdfUrl = getPdfUrl()


  const [pdfAvailable, setPdfAvailable] = React.useState(true)
  const [pdfCheckAttempted, setPdfCheckAttempted] = React.useState(false)
  const [isCheckingPdf, setIsCheckingPdf] = React.useState(false)

  React.useEffect(() => {
    const checkPdfAvailability = async () => {
      if (!pdfUrl || pdfCheckAttempted) return
      
      setIsCheckingPdf(true)
      
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' })
        if (!response.ok) {
          // Try main fallback only if we don't have direct PDF URL from backend
          if (!processedData?.pdf_download_url && processedData?.download_url) {
            const fallbackUrl = processedData.download_url.replace(/\.(docx|doc)$/i, '.pdf')
            const fallbackResponse = await fetch(fallbackUrl, { method: 'HEAD' })
            
            if (!fallbackResponse.ok) {
              setPdfAvailable(false)
            }
          } else {
            setPdfAvailable(false)
          }
        }
      } catch (error) {
        setPdfAvailable(false)
      } finally {
        setPdfCheckAttempted(true)
        setIsCheckingPdf(false)
      }
    }

    checkPdfAvailability()
  }, [pdfUrl, processedData?.download_url, processedData?.pdf_download_url])

  if (!processedData?.download_url) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro na Geração do Documento</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível gerar o documento. O URL de download não está disponível.
          </p>
          <Button onClick={onBackToUpload} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6">
      <div className="max-w-app-container 2xl:max-w-app-container-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={onBackToUpload}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2.5 px-4 py-2.5
                         text-sm font-medium text-slate-700
                         bg-white/80 backdrop-blur-sm
                         border border-slate-200/70 rounded-lg
                         shadow-sm hover:shadow-md
                         hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30
                         hover:border-blue-200 hover:text-slate-900
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
                         transition-all duration-300 ease-out"
            >
              <ArrowLeft 
                size={16} 
                className="text-slate-500 group-hover:text-blue-600 
                           group-hover:-translate-x-1 group-hover:scale-110
                           transition-all duration-300 ease-out" 
              />
              <span className="transition-colors duration-300">Processar Novo Documento</span>
            </motion.button>
            {onBackToHome && <BackToHomeButton onBackToHome={onBackToHome} />}
          </div>
          
          <div className="text-center space-y-4">
            <div className="relative flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200"
                style={{
                  animation: "float 3s ease-in-out infinite"
                }}
              >
                <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </motion.div>
              <div 
                className="absolute inset-0 w-16 h-16 bg-green-400 rounded-full mx-auto opacity-20"
                style={{
                  animation: "pulse 2s infinite"
                }}
              />
            </div>
            
            <div className="space-y-2">
              <h1 
                className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent"
              >
                Processamento Concluído!
              </h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Seu documento foi processado com sucesso. Baixe nos formatos disponíveis abaixo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Processing Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl shadow-slate-200/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                Resumo do Processamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {processedData.files_processed || 1}
                  </div>
                  <div className="text-xs font-medium text-blue-600">Arquivos Processados</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/50">
                  <div className="text-sm font-bold text-emerald-700 mb-1 leading-snug break-words min-h-[2.5rem] flex items-center justify-center">
                    {getTemplateDisplayName(processedData.template_used, templateName)}
                  </div>
                  <div className="text-xs text-emerald-600 mb-2">Template Utilizado</div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-300 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    OK
                  </Badge>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
                  <div className="text-2xl font-bold text-purple-700 mb-1">
                    {(processedData.download_url ? 1 : 0) + (pdfUrl ? 1 : 0)}
                  </div>
                  <div className="text-xs font-medium text-purple-600">Formatos Disponíveis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl shadow-slate-200/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-emerald-600" />
                </div>
                Downloads Disponíveis
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                Escolha o formato desejado para baixar seu documento processado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                ref={downloadCardsRef} 
                tabIndex={0}
                className={`grid gap-6 ${pdfUrl ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-lg mx-auto'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white rounded-lg p-2`}
                style={{ transform: 'none' }}
              >
                {/* DOCX Download - Always show if available */}
                {processedData.download_url && (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 rounded-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-blue-100/40"
                  >
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Documento Word
                      </h3>
                      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        Formato editável para modificações futuras
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                          .DOCX
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                          Editável
                        </Badge>
                        {downloadedFiles.includes('docx') && (
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Baixado
                          </Badge>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // CKDEV-NOTE: Prevent multiple clicks during loading  
                          if (downloadingFile === 'docx') {
                            return
                          }
                          handleDownload('docx', processedData.download_url, docxFilename)
                        }}
                        disabled={downloadingFile === 'docx'}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
                        aria-label="Baixar documento Word editável no formato DOCX"
                      >
                        {downloadingFile === 'docx' ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Baixando...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Baixar DOCX
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* PDF Download - Show if PDF URL is available */}
                {pdfUrl && (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer border-2 border-red-200 hover:border-red-400 hover:shadow-lg hover:shadow-red-100 rounded-lg transition-all duration-300 bg-gradient-to-br from-white to-red-50/30 hover:from-red-50/50 hover:to-red-100/40"
                  >
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200 group-hover:scale-110 transition-transform duration-300">
                        <FileImage className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Documento PDF
                      </h3>
                      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        {!pdfAvailable && pdfCheckAttempted 
                          ? 'PDF indisponível. Use o arquivo DOCX para visualizar o conteúdo'
                          : 'Formato final para impressão e compartilhamento'
                        }
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                        <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
                          .PDF
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                          Final
                        </Badge>
                        {downloadedFiles.includes('pdf') && (
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Baixado
                          </Badge>
                        )}
                        {!pdfAvailable && pdfCheckAttempted && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Indisponível
                          </Badge>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ 
                          scale: (!pdfAvailable && pdfCheckAttempted) ? 1 : 1.05, 
                          boxShadow: (!pdfAvailable && pdfCheckAttempted) ? "none" : "0 10px 25px -5px rgba(239, 68, 68, 0.4)" 
                        }}
                        whileTap={{ scale: (!pdfAvailable && pdfCheckAttempted) ? 1 : 0.95 }}
                        onClick={() => {
                          // CKDEV-NOTE: Additional check to prevent multiple clicks during loading
                          if (downloadingFile === 'pdf' || isCheckingPdf) {
                            return
                          }
                          
                          if (!pdfAvailable && pdfCheckAttempted) {
                            const userWantsDOCX = window.confirm(
                              'O arquivo PDF não está disponível no servidor.\n\n' +
                              'Deseja baixar o arquivo DOCX em seu lugar?\n' +
                              '(Você poderá convertê-lo para PDF usando editores como Word, Google Docs, etc.)'
                            )
                            if (userWantsDOCX) {
                              handleDownload('docx', processedData.download_url, docxFilename)
                            }
                          } else {
                            handleDownload('pdf', pdfUrl, pdfFilename)
                          }
                        }}
                        disabled={downloadingFile === 'pdf' || isCheckingPdf}
                        className={`w-full transition-all duration-200 group-hover:scale-105 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 shadow-lg ${
                          !pdfAvailable && pdfCheckAttempted 
                            ? 'bg-gray-400 text-gray-100 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-xl'
                        }`}
                        aria-label={
                          !pdfAvailable && pdfCheckAttempted 
                            ? "PDF indisponível - Clique para baixar DOCX como alternativa"
                            : "Baixar documento PDF final para impressão e compartilhamento"
                        }
                      >
                        {isCheckingPdf ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Verificando...
                          </>
                        ) : downloadingFile === 'pdf' ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Baixando...
                          </>
                        ) : !pdfAvailable && pdfCheckAttempted ? (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Baixar DOCX
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Baixar PDF
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Download Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 p-4 border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900 mb-2 text-sm">Dicas de Download:</h4>
                    <ul className="space-y-1 text-xs text-amber-800">
                      <li className="flex items-start gap-1.5">
                        <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        Use o formato DOCX para edições e modificações futuras
                      </li>
                      <li className="flex items-start gap-1.5">
                        <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        Use o formato PDF para impressão e compartilhamento final
                      </li>
                      <li className="flex items-start gap-1.5">
                        <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        Os arquivos são gerados dinamicamente e podem ser baixados múltiplas vezes
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default DownloadPage