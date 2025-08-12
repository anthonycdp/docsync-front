import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDebouncedCallback } from 'use-debounce'
import { motion } from "framer-motion"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select"
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  AlertCircle, 
  Info, 
  Eye, 
  Users, 
  CreditCard, 
  Car,
  FileText,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { apiRequest } from "../lib/queryClient"
import { useToast } from "../hooks/use-toast"
import TemplatePreview from "./TemplatePreview"
import { validateField, validateAllFields } from "../lib/validations"
import BackToHomeButton from "./BackToHomeButton"
import { usePageScroll } from '../hooks/use-scroll-to-focus'

// CKDEV-NOTE: Compact form field component with reduced spacing
const FormField = memo(({ 
  label, 
  field, 
  placeholder, 
  type = "text",
  value,
  onChange,
  status,
  message,
  getFieldIcon,
  getFieldClass
}) => {
  const inputRef = useRef(null)
  
  const handleInputChange = useCallback((e) => {
    const { value } = e.target
    const cursorPosition = e.target.selectionStart
    
    onChange(field, value)
    
    requestAnimationFrame(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
      }
    })
  }, [field, onChange])
  
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          type={type}
          value={value || ''}
          onChange={handleInputChange}
          className={`pr-10 transition-all h-9 ${getFieldClass(status)}`}
          placeholder={placeholder}
          autoComplete="off"
        />
        {getFieldIcon(status) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getFieldIcon(status)}
          </div>
        )}
      </div>
      {status !== 'neutral' && message && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs flex items-center space-x-1 ${
            status === 'valid' ? 'text-green-600' :
            status === 'invalid' ? 'text-red-600' :
            'text-amber-600'
          }`}
        >
          {status === 'valid' ? (
            <CheckCircle className="w-3 h-3" />
          ) : status === 'invalid' ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Info className="w-3 h-3" />
          )}
          <span>{message}</span>
        </motion.p>
      )}
    </div>
  )
})

// CKDEV-NOTE: Collapsible section component to save vertical space
const CollapsibleSection = memo(({ 
  title, 
  icon: Icon, 
  iconColor = "text-blue-600", 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Icon className={`w-4 h-4 ${iconColor}`} />
            <span>{title}</span>
          </CardTitle>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0 space-y-3">
          {children}
        </CardContent>
      )}
    </Card>
  )
})

export default function PreviewStep({ 
  sessionId,
  onDataCorrected = () => {}, 
  onGenerateDocuments = () => {}, 
  isGenerating = false,
  onBack = () => {},
  onBackToHome
}) {
  const [selectedDocument, setSelectedDocument] = useState('')
  const [formData, setFormData] = useState({})
  const [validationResults, setValidationResults] = useState({})
  const [templateType, setTemplateType] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isInitialRender, setIsInitialRender] = useState(true)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const fieldUpdateTimeouts = useRef({})
  
  // CKDEV-NOTE: Ref para o elemento de foco principal (cabeçalho da revisão)
  const headerRef = useRef(null)
  
  // CKDEV-NOTE: Scroll inteligente que foca no cabeçalho da revisão
  usePageScroll(headerRef, 'preview')

  const { data: sessionData, isLoading: isLoadingSession, error: sessionError } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required')
      
      try {
        const response = await apiRequest('GET', `/api/sessions/${sessionId}`)
        const result = await response.json()
        return result
      } catch (error) {
        throw new Error(`Falha ao carregar sessão: ${error.message}`)
      }
    },
    enabled: !!sessionId,
    retry: 1
  })

  const getUploadedFiles = (templateType) => {
    const templatePreviewFile = {
      id: "template-preview",
      originalName: "template_preview.html",
      fileName: "template_preview.html",
      isTemplatePreview: true
    }
    
    const baseFiles = [
      templatePreviewFile,
      {
        id: "1",
        originalName: "proposta_documento.pdf", 
        fileName: "proposta_documento.pdf"
      }
    ]
    
    if (templateType === 'responsabilidade_veiculo') {
      return [
        templatePreviewFile,
        { id: "1", originalName: "proposta_veiculo.pdf", fileName: "proposta_veiculo.pdf" }
      ]
    } else if (templateType === 'cessao_credito') {
      return [
        templatePreviewFile,
        { id: "1", originalName: "proposta_cessao.pdf", fileName: "proposta_cessao.pdf" },
        { id: "2", originalName: "cnh_terceiro.jpg", fileName: "cnh_terceiro.jpg" },
        { id: "3", originalName: "comprovante_endereco.pdf", fileName: "comprovante_endereco.pdf" }
      ]
    } else if (templateType === 'pagamento_terceiro') {
      return [
        templatePreviewFile,
        { id: "1", originalName: "proposta_pagamento.pdf", fileName: "proposta_pagamento.pdf" },
        { id: "2", originalName: "cnh_terceiro.jpg", fileName: "cnh_terceiro.jpg" },
        { id: "3", originalName: "comprovante_pagamento.pdf", fileName: "comprovante_pagamento.pdf" }
      ]
    }
    
    return baseFiles
  }

  const uploadedFiles = getUploadedFiles(templateType)
  const selectedFile = uploadedFiles.find(file => file.originalName === selectedDocument)

  const debouncedAPIUpdate = useDebouncedCallback(
    async (field, value, oldValue) => {
      if (sessionId) {
        try {
          setIsUpdating(true)
          const response = await apiRequest('PATCH', `/api/sessions/${sessionId}`, {
            field,
            value,
            oldValue
          })
          const data = await response.json()
          
          if (data.success !== false) {
            setValidationResults(data.validation_results || {})
            onDataCorrected(formData, data.validation_results || {})
          }
        } catch (error) {
          // Handle error silently
        } finally {
          setIsUpdating(false)
        }
      }
    },
    1000,
    { maxWait: 3000 }
  )

  const updateFieldMutation = useMutation({
    mutationFn: async ({ field, value, oldValue }) => {
      const response = await apiRequest('PATCH', `/api/sessions/${sessionId}`, {
        field,
        value,
        oldValue
      })
      return response.json()
    },
    onSuccess: (data) => {
      setFormData(data.data)
      setValidationResults(data.validation_results)
      onDataCorrected(data.data, data.validation_results)
    },
    onError: (error) => {
      // Handle error silently
    }
  })

  useEffect(() => {
    if (sessionData && sessionData.success) {
      const sessionDataContent = sessionData.data || sessionData
      const extractedData = sessionDataContent.extracted_data || {}
      let validationResults = sessionDataContent.validation_results || {}
      const templateType = sessionDataContent.template_type || ''
      
      // CKDEV-NOTE: Sempre executar validações quando há dados extraídos
      if (Object.keys(extractedData).length > 0) {
        validationResults = validateAllFields(extractedData)
      }
      
      setFormData(extractedData)
      setValidationResults(validationResults)
      setTemplateType(templateType)
      
      setSelectedDocument('template_preview.html')
    }
  }, [sessionData])

  useEffect(() => {
    // CKDEV-NOTE: Executar validações sempre que formData mudar
    if (Object.keys(formData).length > 0) {
      const currentValidations = validateAllFields(formData)
      setValidationResults(currentValidations)
      setIsInitialRender(false)
    }
  }, [formData])

  useEffect(() => {
    if (templateType) {
      setSelectedDocument('template_preview.html')
    }
  }, [templateType])

  useEffect(() => {
    return () => {
      debouncedAPIUpdate.cancel()
    }
  }, [debouncedAPIUpdate])

  const handleFieldChange = useCallback((field, value) => {
    const oldValue = getFieldValue(field)
    
    setFormData(prev => {
      const newData = { ...prev }
      const fieldParts = field.split('.')
      let target = newData
      
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (!target[fieldParts[i]]) {
          target[fieldParts[i]] = {}
        }
        target = target[fieldParts[i]]
      }
      
      target[fieldParts[fieldParts.length - 1]] = value
      return newData
    })

    const validationResult = validateField(field, value)
    setValidationResults(prev => ({
      ...prev,
      [field]: validationResult
    }))

    debouncedAPIUpdate(field, value, oldValue)
  }, [debouncedAPIUpdate, formData])

  const getFieldValue = (field) => {
    const fieldParts = field.split('.')
    let value = formData
    
    for (const part of fieldParts) {
      value = value?.[part]
    }
    
    return value || ''
  }

  const getFieldStatus = (field) => {
    const validation = validationResults[field]
    if (!validation) return 'neutral'
    
    // CKDEV-NOTE: Garantir que o status seja sempre válido
    if (validation.status && ['valid', 'invalid', 'warning', 'neutral'].includes(validation.status)) {
      return validation.status
    }
    
    // Fallback para status baseado na presença de valor
    const value = getFieldValue(field)
    if (!value || value.trim() === '') {
      return 'invalid'
    }
    
    return 'valid'
  }

  const getFieldIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'warning':
        return <Info className="w-4 h-4 text-amber-600" />
      default:
        return null
    }
  }

  const getFieldClass = (status) => {
    switch (status) {
      case 'valid':
        return 'border-green-300 bg-green-50/50 focus:ring-green-500 focus:border-green-500'
      case 'invalid':
        return 'border-red-300 bg-red-50/50 focus:ring-red-500 focus:border-red-500'
      case 'warning':
        return 'border-amber-300 bg-amber-50/50 focus:ring-amber-500 focus:border-amber-500'
      default:
        return 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
    }
  }

  const getValidationMessage = (field) => {
    const validation = validationResults[field]
    if (!validation) return null
    
    // CKDEV-NOTE: Garantir que sempre retorne uma mensagem quando há validação
    if (validation.message) {
      return validation.message
    }
    
    // Fallback messages based on status
    switch (validation.status) {
      case 'valid':
        return `${getFieldLabel(field)} válido`
      case 'invalid':
        return `${getFieldLabel(field)} inválido`
      case 'warning':
        return `${getFieldLabel(field)} precisa de atenção`
      default:
        return null
    }
  }

  const getFieldLabel = (field) => {
    const labels = {
      'client.name': 'Nome',
      'client.cpf': 'CPF',
      'client.rg': 'RG',
      'client.address': 'Endereço',
      'usedVehicle.brand': 'Marca',
      'usedVehicle.model': 'Modelo',
      'usedVehicle.year': 'Ano/Modelo',
      'usedVehicle.color': 'Cor',
      'usedVehicle.plate': 'Placa',
      'usedVehicle.chassi': 'Chassi',
      'usedVehicle.value': 'Valor',
      'newVehicle.brand': 'Marca',
      'newVehicle.model': 'Modelo',
      'newVehicle.yearModel': 'Ano/Modelo',
      'newVehicle.color': 'Cor',
      'newVehicle.chassi': 'Chassi',
      'third.name': 'Nome',
      'third.cpf': 'CPF',
      'third.rg': 'RG',
      'third.address': 'Endereço',
      'payment.amount': 'Valor',
      'payment.method': 'Método',
      'payment.bank_name': 'Banco',
      'payment.agency': 'Agência',
      'payment.account': 'Conta'
    }
    return labels[field] || field
  }

  const canGenerate = () => {
    let requiredFields = [
      'client.name', 'client.cpf', 'client.rg', 'client.address'
    ]
    
    if (templateType === 'responsabilidade_veiculo') {
      requiredFields.push(
        'usedVehicle.brand', 'usedVehicle.model', 'usedVehicle.color', 
        'usedVehicle.year', 'usedVehicle.plate', 'usedVehicle.chassi',
        'usedVehicle.value'
      )
    }
    
    if (templateType === 'cessao_credito') {
      requiredFields.push(
        'usedVehicle.brand', 'usedVehicle.model', 'usedVehicle.color', 
        'usedVehicle.year', 'usedVehicle.plate', 'usedVehicle.chassi',
        'usedVehicle.value',
        'newVehicle.brand', 'newVehicle.model', 'newVehicle.yearModel', 'newVehicle.color', 'newVehicle.chassi',
        'third.name', 'third.cpf', 'third.rg', 'third.address'
      )
    }
    
    if (templateType === 'pagamento_terceiro') {
      requiredFields.push(
        'third.name', 'third.cpf', 'third.rg',
        'newVehicle.brand', 'newVehicle.model', 'newVehicle.yearModel', 'newVehicle.color', 'newVehicle.chassi',
        'payment.amount', 'payment.method', 'payment.bank_name', 'payment.agency', 'payment.account'
      )
    }
    
    return requiredFields.every(field => {
      const status = getFieldStatus(field)
      const value = getFieldValue(field)
      
      return value && value.trim() !== '' && status !== 'invalid'
    })
  }

  if (sessionError) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Dados</h3>
          <p className="text-gray-600 mb-4">Não foi possível carregar os dados da sessão.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="app-container">
        <div className="app-content-wrapper">
        {/* CKDEV-NOTE: Compact header with reduced spacing */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle 
                    ref={headerRef}
                    className="flex items-center space-x-2 text-lg"
                  >
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Revisão de Dados Extraídos</span>
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Verifique e corrija as informações antes de gerar o documento final
                  </CardDescription>
                </div>
                {onBackToHome && (
                  <div className="flex-shrink-0">
                    <BackToHomeButton onBackToHome={onBackToHome} />
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* CKDEV-NOTE: Optimized layout with better space utilization */}
        <div className="app-main-grid">
          {/* Document Viewer - Takes 2/3 of the space */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="app-content-area"
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Preview do Template</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="bg-gray-50 rounded-lg h-full border border-gray-200 overflow-hidden flex flex-col">
                  {selectedFile ? (
                    selectedFile.isTemplatePreview ? (
                      <TemplatePreview 
                        templateType={templateType}
                        formData={formData}
                      />
                    ) : selectedFile.originalName.toLowerCase().endsWith('.pdf') ? (
                      <div className="bg-white rounded-lg shadow-sm p-6 text-center m-4">
                        <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 mb-2">{selectedFile.originalName}</h4>
                        <p className="text-gray-600">Visualização PDF (simulada)</p>
                      </div>
                    ) : selectedFile.originalName.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
                      <div className="bg-white rounded-lg shadow-sm p-6 text-center m-4">
                        <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 mb-2">{selectedFile.originalName}</h4>
                        <p className="text-gray-600">Visualização de Imagem (simulada)</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm p-6 text-center m-4">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 mb-2">{selectedFile.originalName}</h4>
                        <p className="text-gray-600">Tipo de arquivo não suportado para visualização</p>
                      </div>
                    )
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center m-4">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Visualização do Documento</h4>
                      <p className="text-sm text-gray-600">Nenhum documento selecionado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Editor - Takes 1/3 of the space with sticky layout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="app-sidebar"
          >
            {/* Dados do Cliente */}
            <CollapsibleSection 
              title="Dados do Cliente" 
              icon={Users} 
              iconColor="text-green-600"
            >
              <div className="grid grid-cols-1 gap-3">
                <FormField 
                  label="Nome Completo" 
                  field="client.name" 
                  placeholder="Digite o nome completo"
                  value={getFieldValue('client.name')}
                  onChange={handleFieldChange}
                  status={getFieldStatus('client.name')}
                  message={getValidationMessage('client.name')}
                  getFieldIcon={getFieldIcon}
                  getFieldClass={getFieldClass}
                />
                <FormField 
                  label="CPF" 
                  field="client.cpf" 
                  placeholder="Digite o CPF"
                  value={getFieldValue('client.cpf')}
                  onChange={handleFieldChange}
                  status={getFieldStatus('client.cpf')}
                  message={getValidationMessage('client.cpf')}
                  getFieldIcon={getFieldIcon}
                  getFieldClass={getFieldClass}
                />
                <FormField 
                  label="RG" 
                  field="client.rg" 
                  placeholder="Digite o RG"
                  value={getFieldValue('client.rg')}
                  onChange={handleFieldChange}
                  status={getFieldStatus('client.rg')}
                  message={getValidationMessage('client.rg')}
                  getFieldIcon={getFieldIcon}
                  getFieldClass={getFieldClass}
                />
                <FormField 
                  label="Endereço Completo" 
                  field="client.address" 
                  placeholder="Rua, número, bairro, CEP, cidade-UF"
                  value={getFieldValue('client.address')}
                  onChange={handleFieldChange}
                  status={getFieldStatus('client.address')}
                  message={getValidationMessage('client.address')}
                  getFieldIcon={getFieldIcon}
                  getFieldClass={getFieldClass}
                />
              </div>
            </CollapsibleSection>

            {/* Dados do Terceiro - Specific for pagamento_terceiro template */}
            {templateType === 'pagamento_terceiro' && (
              <CollapsibleSection 
                title="Dados do Terceiro" 
                icon={Users} 
                iconColor="text-indigo-600"
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField 
                    label="Nome Completo" 
                    field="third.name" 
                    placeholder="Digite o nome completo do cessionário"
                    value={getFieldValue('third.name')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.name')}
                    message={getValidationMessage('third.name')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="RG" 
                    field="third.rg" 
                    placeholder="Digite o RG"
                    value={getFieldValue('third.rg')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.rg')}
                    message={getValidationMessage('third.rg')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="CPF" 
                    field="third.cpf" 
                    placeholder="Digite o CPF"
                    value={getFieldValue('third.cpf')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.cpf')}
                    message={getValidationMessage('third.cpf')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                </div>
              </CollapsibleSection>
            )}

            {/* Dados do Veículo Usado - Not for pagamento_terceiro template */}
            {templateType !== 'pagamento_terceiro' && (
              <CollapsibleSection 
                title="Dados do Veículo Usado" 
                icon={Car} 
                iconColor="text-orange-600"
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField 
                    label="Marca" 
                    field="usedVehicle.brand" 
                    placeholder="Ex: Chevrolet, Toyota, etc."
                    value={getFieldValue('usedVehicle.brand')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.brand')}
                    message={getValidationMessage('usedVehicle.brand')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Modelo" 
                    field="usedVehicle.model" 
                    placeholder="Ex: Tracker, Corolla, etc."
                    value={getFieldValue('usedVehicle.model')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.model')}
                    message={getValidationMessage('usedVehicle.model')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Ano/Modelo" 
                    field="usedVehicle.year" 
                    placeholder="2023/2024"
                    value={getFieldValue('usedVehicle.year')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.year')}
                    message={getValidationMessage('usedVehicle.year')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Cor" 
                    field="usedVehicle.color" 
                    placeholder="Ex: Preto, Branco, etc."
                    value={getFieldValue('usedVehicle.color')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.color')}
                    message={getValidationMessage('usedVehicle.color')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Placa" 
                    field="usedVehicle.plate" 
                    placeholder="Digite a placa do veículo"
                    value={getFieldValue('usedVehicle.plate')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.plate')}
                    message={getValidationMessage('usedVehicle.plate')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Chassi" 
                    field="usedVehicle.chassi" 
                    placeholder="Digite o número do chassi"
                    value={getFieldValue('usedVehicle.chassi')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.chassi')}
                    message={getValidationMessage('usedVehicle.chassi')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Valor do Veículo" 
                    field="usedVehicle.value" 
                    placeholder="Ex: 50000.00"
                    value={getFieldValue('usedVehicle.value')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('usedVehicle.value')}
                    message={getValidationMessage('usedVehicle.value')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                </div>
              </CollapsibleSection>
            )}

            {/* Dados do Veículo Novo - Specific for pagamento_terceiro template */}
            {templateType === 'pagamento_terceiro' && (
              <CollapsibleSection 
                title="Dados do Veículo Novo" 
                icon={Sparkles} 
                iconColor="text-purple-600"
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField 
                    label="Marca" 
                    field="newVehicle.brand" 
                    placeholder="Ex: Volkswagen, Ford, etc."
                    value={getFieldValue('newVehicle.brand')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.brand')}
                    message={getValidationMessage('newVehicle.brand')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Modelo" 
                    field="newVehicle.model" 
                    placeholder="Ex: NIVUS HIGHLINE 200 TSI 128HP AT C"
                    value={getFieldValue('newVehicle.model')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.model')}
                    message={getValidationMessage('newVehicle.model')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Ano/Modelo" 
                    field="newVehicle.yearModel" 
                    placeholder="2025/2025"
                    value={getFieldValue('newVehicle.yearModel')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.yearModel')}
                    message={getValidationMessage('newVehicle.yearModel')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Cor" 
                    field="newVehicle.color" 
                    placeholder="Ex: BRANCA CRISTAL, AZUL TITAN, etc."
                    value={getFieldValue('newVehicle.color')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.color')}
                    message={getValidationMessage('newVehicle.color')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Chassi" 
                    field="newVehicle.chassi" 
                    placeholder="Ex: 9BWCH6CH2SP016002"
                    value={getFieldValue('newVehicle.chassi')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.chassi')}
                    message={getValidationMessage('newVehicle.chassi')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                </div>
              </CollapsibleSection>
            )}

            {/* Dados do Veículo Novo - Specific for cessao_credito template */}
            {templateType === 'cessao_credito' && (
              <CollapsibleSection 
                title="Dados do Veículo Novo" 
                icon={Sparkles} 
                iconColor="text-purple-600"
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField 
                    label="Marca" 
                    field="newVehicle.brand" 
                    placeholder="Ex: Volkswagen, Ford, etc."
                    value={getFieldValue('newVehicle.brand')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.brand')}
                    message={getValidationMessage('newVehicle.brand')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Modelo" 
                    field="newVehicle.model" 
                    placeholder="Ex: NIVUS HIGHLINE 200 TSI 128HP AT C"
                    value={getFieldValue('newVehicle.model')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.model')}
                    message={getValidationMessage('newVehicle.model')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Ano/Modelo" 
                    field="newVehicle.yearModel" 
                    placeholder="2025/2025"
                    value={getFieldValue('newVehicle.yearModel')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.yearModel')}
                    message={getValidationMessage('newVehicle.yearModel')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Cor" 
                    field="newVehicle.color" 
                    placeholder="Ex: BRANCA CRISTAL, AZUL TITAN, etc."
                    value={getFieldValue('newVehicle.color')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.color')}
                    message={getValidationMessage('newVehicle.color')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Chassi" 
                    field="newVehicle.chassi" 
                    placeholder="Ex: 9BWCH6CH2SP016002"
                    value={getFieldValue('newVehicle.chassi')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('newVehicle.chassi')}
                    message={getValidationMessage('newVehicle.chassi')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                </div>
              </CollapsibleSection>
            )}

            {/* Dados do Terceiro/Cessionário - Specific for cessao_credito template */}
            {templateType === 'cessao_credito' && (
              <CollapsibleSection 
                title="Dados do Terceiro" 
                icon={Users} 
                iconColor="text-indigo-600"
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField 
                    label="Nome Completo" 
                    field="third.name" 
                    placeholder="Digite o nome completo do cessionário"
                    value={getFieldValue('third.name')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.name')}
                    message={getValidationMessage('third.name')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="RG" 
                    field="third.rg" 
                    placeholder="Digite o RG"
                    value={getFieldValue('third.rg')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.rg')}
                    message={getValidationMessage('third.rg')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="CPF" 
                    field="third.cpf" 
                    placeholder="Digite o CPF"
                    value={getFieldValue('third.cpf')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.cpf')}
                    message={getValidationMessage('third.cpf')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Endereço Completo" 
                    field="third.address" 
                    placeholder="Rua, número, bairro, CEP, cidade-UF"
                    value={getFieldValue('third.address')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('third.address')}
                    message={getValidationMessage('third.address')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                </div>
              </CollapsibleSection>
            )}

            {/* Dados do Comprovante de Pagamento - Specific for pagamento_terceiro template */}
            {templateType === 'pagamento_terceiro' && (
              <CollapsibleSection 
                title="Dados do Comprovante de Pagamento" 
                icon={CreditCard} 
                iconColor="text-purple-600"
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField 
                    label="Valor Pago" 
                    field="payment.amount" 
                    placeholder="Ex: 50.000,00"
                    value={getFieldValue('payment.amount')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('payment.amount')}
                    message={getValidationMessage('payment.amount')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Método de Pagamento" 
                    field="payment.method" 
                    placeholder="Ex: PIX, TED, Boleto"
                    value={getFieldValue('payment.method')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('payment.method')}
                    message={getValidationMessage('payment.method')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Banco Pagador" 
                    field="payment.bank_name" 
                    placeholder="Ex: Banco Itaú, Nubank"
                    value={getFieldValue('payment.bank_name')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('payment.bank_name')}
                    message={getValidationMessage('payment.bank_name')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Agência" 
                    field="payment.agency" 
                    placeholder="Ex: 0001"
                    value={getFieldValue('payment.agency')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('payment.agency')}
                    message={getValidationMessage('payment.agency')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                  <FormField 
                    label="Conta" 
                    field="payment.account" 
                    placeholder="Ex: 12345-6"
                    value={getFieldValue('payment.account')}
                    onChange={handleFieldChange}
                    status={getFieldStatus('payment.account')}
                    message={getValidationMessage('payment.account')}
                    getFieldIcon={getFieldIcon}
                    getFieldClass={getFieldClass}
                  />
                </div>
              </CollapsibleSection>
            )}
          </motion.div>
        </div>

        {/* CKDEV-NOTE: Compact action buttons with reduced spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <Button 
                  onClick={onGenerateDocuments}
                  disabled={!canGenerate() || isGenerating}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      Gerar Documentos
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}