import { useState, useEffect, useCallback } from "react"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"
import { Button } from "./ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import { apiRequest } from "../lib/queryClient"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export default function TemplatePreview({ templateType, formData, zoom = 100 }) {
  const [previewHtml, setPreviewHtml] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentZoom, setCurrentZoom] = useState(zoom)

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 25, 50))
  }

  // CKDEV-NOTE: Full height modern document layout with improved visual hierarchy
  const renderModernTemplateContent = () => {
    return (
      <div className="app-document-container h-full flex flex-col">
        <Card className="shadow-sm mb-1 flex-1 flex flex-col">
          <CardContent className="p-3">
            <div
              className="template-preview-html flex-1 overflow-auto"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </CardContent>
        </Card>
      </div>
    )
  };

  // CKDEV-NOTE: Full height modern template renderer with improved field layout
  const renderModernVehicleDataTemplate = () => {
    // CKDEV-NOTE: Read values from formData to avoid hardcoded sensitive data
    const vehicleBrand = formData?.usedVehicle?.brand || 'VEHICLE_BRAND'
    const vehicleModel = formData?.usedVehicle?.model || 'VEHICLE_MODEL'
    const vehicleYear = formData?.usedVehicle?.year || '0000/0000'
    const vehicleColor = formData?.usedVehicle?.color || 'COLOR'
    const vehiclePlate = formData?.usedVehicle?.plate || 'ABC-0000'
    const vehicleChassi = formData?.usedVehicle?.chassi || 'VEHICLE_CHASSIS'
    const vehicleValue = formData?.usedVehicle?.value || '0,00'

    const clientName = formData?.client?.name || 'CLIENT_NAME'
    const clientCpf = formData?.client?.cpf || '000.000.000-00'
    const clientRg = formData?.client?.rg || 'RG_NUMBER'
    const clientAddress = formData?.client?.address || 'FULL_ADDRESS'

    return (
      <div className="app-document-container h-full flex flex-col">
        <Card className="shadow-sm mb-1 flex-1 flex flex-col">
          <CardContent className="p-3">
            <div className="max-w-[800px] mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center mb-2 flex-shrink-0">
                <h1 className="text-sm font-bold tracking-wide uppercase text-neutral-800 mb-1">
                  DADOS DO VEÍCULO USADO
                </h1>
                <Separator className="w-12 mx-auto" />
              </div>
              
              <div className="space-y-2 flex-1 flex flex-col overflow-y-auto">
                {/* Vehicle Specifications */}
                <Card className="border shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-neutral-700 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">1</Badge>
                      ESPECIFICAÇÕES DO VEÍCULO
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="p-3 pt-2 overflow-hidden">
                    <div className="grid gap-2 max-w-full">
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Marca</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.brand ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {vehicleBrand}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Modelo</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.model ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {vehicleModel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Ano/Modelo</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.year ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {vehicleYear}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Cor</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.color ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {vehicleColor}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Placa</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.plate ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {vehiclePlate}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Chassi</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.chassi ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {vehicleChassi}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Valor</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.usedVehicle?.value ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            R$ {vehicleValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Data */}
                <Card className="border shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-neutral-700 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">2</Badge>
                      DADOS DO CLIENTE
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="p-3 pt-2 overflow-hidden">
                    <div className="grid gap-2 max-w-full">
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Nome</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.client?.name ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {clientName}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">CPF</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.client?.cpf ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {clientCpf}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">RG</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.client?.rg ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {clientRg}
                          </span>
                        </div>
                      </div>
                      
                      <div className="field-block flex items-center gap-2 p-2 bg-gray-50/50 rounded border border-gray-200 min-h-[40px] hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-semibold text-gray-700">Endereço</div>
                        <div className="flex-1 flex items-center justify-start px-2 min-w-0 overflow-hidden">
                          <span className={`field-highlight ${formData?.client?.address ? 'filled' : 'empty'} font-medium text-sm truncate block w-full`}>
                            {clientAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-3 print:break-inside-avoid flex-shrink-0">
                  <div className="text-center">
                    <Card className="border shadow-sm bg-blue-50">
                      <CardContent className="p-2">
                        <p className="text-xs font-semibold text-neutral-700">
                          CPF nº: <span className={`field-highlight ${formData?.client?.cpf ? 'filled' : 'empty'} font-bold`}>{clientCpf}</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  };

  const generateResponsabilidadeTemplate = useCallback((data) => {
    const clientName = data.client?.name || ''
    const clientCpf = data.client?.cpf || ''
    const clientRg = data.client?.rg || ''
    const clientAddress = data.client?.address || ''
    
    const vehicleBrand = data.usedVehicle?.brand || ''
    const vehicleModel = data.usedVehicle?.model || ''
    const vehicleYear = data.usedVehicle?.year || ''
    const vehicleColor = data.usedVehicle?.color || ''
    const vehiclePlate = data.usedVehicle?.plate || ''
    const vehicleChassi = data.usedVehicle?.chassi || ''
    const vehicleValue = data.usedVehicle?.value || ''
    
    const documentDate = data.document?.date || new Date().toLocaleDateString('pt-BR')

    // Página 1 - Dados do Cliente e Declaração
    const page1 = `
      <div class="max-w-[800px] mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm print:shadow-none print:p-0">
        <h1 class="text-center text-base md:text-lg font-bold tracking-wide uppercase mb-4 text-neutral-800">
          TERMO DE RESPONSABILIDADE SOBRE VEÍCULO USADO NA TROCA
        </h1>
        
        <div class="space-y-3 text-[13px] leading-6 text-neutral-800">
          <p class="text-justify indent-6">
            Eu, <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">${clientName || 'NOME_CLIENTE'}</span>, 
            portador (a) do RG nº <span class="field-highlight ${data.client?.rg ? 'filled' : 'empty'}">${clientRg || 'RG_NUMERO'}</span> 
            e inscrito(a) no CPF sob o nº <span class="field-highlight ${data.client?.cpf ? 'filled' : 'empty'}">${clientCpf || '000.000.000-00'}</span>, 
            residente e domiciliado (a) <span class="field-highlight ${data.client?.address ? 'filled' : 'empty'}">${clientAddress || 'ENDERECO_COMPLETO'}</span>, 
            doravante denominado (a) CLIENTE, por meio do presente termo declaro, para todos os fins de direito, que vendi o VEÍCULO USADO abaixo discriminado à (concessionária), inscrita no CNPJ/MF sob nº 60.894.136/0004-67 doravante denominada CONCESSIONÁRIA ou COMPRADORA, o qual foi negociado em perfeitas condições de uso, livre e desembaraçado de quaisquer ônus financeiros, judiciais e extrajudiciais, inclusive penhora, registros de roubos e furtos, remarcações/adulteração de chassi ou partes do veículo, que impossibilitem a transferência regular de seu domínio perante os órgãos e entidades.
          </p>

          <p class="text-justify indent-6">
            Estou ciente de minha integral responsabilidade civil e criminalmente por eventual evicção, assumindo integralmente a responsabilidade pela legitimidade e procedência do veículo, concordando e reconhecendo que eventuais bloqueios judiciais e/ou administrativos de natureza fiscal ou não, multas, tributos atrasados, em especial o IPVA, DPVAT, infrações existentes junto ao DETRAN ou outro órgão equivalente, que recaiam sobre o referido VEÍCULO USADO, até a data de sua efetiva entrega à CONCESSIONÁRIA, mesmo que lançadas posteriormente, serão de responsabilidade e atribuição exclusiva do CLIENTE, obrigando-se a realizar o pagamento no prazo de 48 (quarenta e oito) horas após o comunicado verbal e/ou escrito por parte da CONCESSIONÁRIA, ciente de que eventual inadimplemento ensejará em multa no montante de 2% (dois por cento) sobre o valor do débito e correção monetária pela variação positiva do IGPM/FGV, sem prejuízo de serem adotadas as medidas judiciais cabíveis e ainda, a regularizar as pendências relativas aos bloqueios.
          </p>

          <p class="text-justify indent-6">
            No caso de serem referidos encargos quitados pela COMPRADORA, ficará a mesma sub-rogada nestes créditos, ficando expressamente convencionado que se a COMPRADORA tiver que promover a execução judicial de seu crédito, o mesmo será acrescido de juros moratórios de 1% (um por cento) ao mês, mais multa de 10% (dez por cento) e correção monetária, sujeitando-se ainda ao pagamento das custas e despesas processuais, além da verba honorária de 20% (vinte por cento) sobre o valor da causa.
          </p>

          <p class="text-justify indent-6">
            Por fim, estou ciente que, na hipótese de as informações acima mencionadas não serem verdadeiras, estarei sujeito(a) a todas as cominações legais, inclusive a prevista no artigo 299 do Código Penal Brasileiro.
          </p>

          <div class="mt-8 print:break-inside-avoid">
            <div class="text-center mb-6">
              <p class="text-sm font-semibold">LOCAL E DATA: SÃO JOSÉ DOS CAMPOS<span class="field-highlight filled">${documentDate}</span></p>
            </div>

            <div class="grid md:grid-cols-1 gap-8 items-end">
              <div class="text-center">
                <div class="w-64 mx-auto h-px bg-neutral-700 mb-2"></div>
                <p class="text-xs italic">
                  <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">${clientName || 'NOME_CLIENTE'}</span><br/>
                  CLIENTE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Página 2 - Dados do Veículo
    const page2 = `
      <div class="max-w-[800px] mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm print:shadow-none print:p-0">
        <h1 class="text-center text-base md:text-lg font-bold tracking-wide uppercase mb-4 text-neutral-800">
          DADOS DO VEÍCULO USADO
        </h1>
        
        <div class="space-y-3 text-[13px] leading-6 text-neutral-800">
          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              ESPECIFICAÇÕES DO VEÍCULO
            </h2>
            <div class="grid gap-2 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Marca:</span>
                <span class="field-highlight ${data.usedVehicle?.brand ? 'filled' : 'empty'} break-words hyphens-auto">
                  ${vehicleBrand || 'MARCA_VEICULO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Modelo:</span>
                <span class="field-highlight ${data.usedVehicle?.model ? 'filled' : 'empty'} break-words hyphens-auto">
                  ${vehicleModel || 'MODELO_VEICULO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Ano/Modelo:</span>
                <span class="field-highlight ${data.usedVehicle?.year ? 'filled' : 'empty'}">
                  ${vehicleYear || '0000/0000'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Cor:</span>
                <span class="field-highlight ${data.usedVehicle?.color ? 'filled' : 'empty'}">
                  ${vehicleColor || 'COR'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Placa:</span>
                <span class="field-highlight ${data.usedVehicle?.plate ? 'filled' : 'empty'}">
                  ${vehiclePlate || 'ABC-0000'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Chassi:</span>
                <span class="field-highlight ${data.usedVehicle?.chassi ? 'filled' : 'empty'} break-words">
                  ${vehicleChassi || 'CHASSI_NUMERO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Valor:</span>
                <span class="field-highlight ${data.usedVehicle?.value ? 'filled' : 'empty'}">
                  R$ ${vehicleValue || '0,00'}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DO CLIENTE
            </h2>
            <div class="grid gap-2 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Nome:</span>
                <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">
                  ${clientName || 'NOME_CLIENTE'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">CPF:</span>
                <span class="field-highlight ${data.client?.cpf ? 'filled' : 'empty'}">
                  ${clientCpf || '000.000.000-00'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">RG:</span>
                <span class="field-highlight ${data.client?.rg ? 'filled' : 'empty'}">
                  ${clientRg || 'RG_NUMERO'}
                </span>
              </div>
              <div class="flex gap-2 md:col-span-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Endereço:</span>
                <span class="field-highlight ${data.client?.address ? 'filled' : 'empty'} break-words">
                  ${clientAddress || 'ENDERECO_COMPLETO'}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-8 print:break-inside-avoid">
            <div class="text-center mb-6">
              <p class="text-sm font-semibold">CPF nº: <span class="field-highlight ${data.client?.cpf ? 'filled' : 'empty'}">${clientCpf || '000.000.000-00'}</span></p>
            </div>
          </div>
        </div>
      </div>
    `

    return { page1, page2 }
  }, [])

  const generatePagamentoTerceiroTemplate = useCallback((data) => {
    const cedenteName = data.client?.name || ''
    const cedenteCpf = data.client?.cpf || ''
    const cedenteRg = data.client?.rg || ''
    const cessionarioName = data.third?.name || ''
    const cessionarioCpf = data.third?.cpf || ''
    const cessionarioRg = data.third?.rg || ''
    const concessionaria = data.concessionaria?.name || ''
    const concessionariaCnpj = data.concessionaria?.cnpj || ''
    const valor = data.payment?.amount || ''
    const formaPagamento = data.payment?.method || ''
    const banco = data.payment?.bank_name || ''
    const conta = data.payment?.account || ''
    const agencia = data.payment?.agency || ''
    const veiculoModelo = data.newVehicle?.model || data.usedVehicle?.model || ''
    const veiculoMarca = data.newVehicle?.brand || data.usedVehicle?.brand || ''
    const veiculoCor = data.newVehicle?.color || data.usedVehicle?.color || ''
    const veiculoAno = data.newVehicle?.yearModel || data.usedVehicle?.year || ''
    const pedidoVenda = data.document?.proposal_number || ''
    const documentDate = data.document?.date || new Date().toLocaleDateString('pt-BR')
    const documentLocation = data.document?.location || 'CIDADE/UF'

    return `
      <div class="max-w-[800px] mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm print:shadow-none print:p-0">
        <h1 class="text-center text-base md:text-lg font-bold tracking-wide uppercase mb-4 text-neutral-800">
          DECLARAÇÃO DE PAGAMENTO POR TERCEIROS
        </h1>
        
        <div class="space-y-3 text-[13px] leading-6 text-neutral-800">
          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DO CEDENTE
            </h2>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Nome:</span>
                <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">
                  ${cedenteName || 'NOME_CEDENTE'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">CPF:</span>
                <span class="field-highlight ${data.client?.cpf ? 'filled' : 'empty'}">
                  ${cedenteCpf || '000.000.000-00'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">RG:</span>
                <span class="field-highlight ${data.client?.rg ? 'filled' : 'empty'}">
                  ${cedenteRg || 'RG_NUMERO'}
                </span>
              </div>
            </div>
          </div>

          <p class="text-justify indent-6">
            Neste ato, declaro a quem possa interessar, que paguei por conta e ordem do CESSIONÁRIO abaixo especificado:
          </p>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DO CESSIONÁRIO
            </h2>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Nome:</span>
                <span class="field-highlight ${data.third?.name ? 'filled' : 'empty'}">
                  ${cessionarioName || 'NOME_CESSIONARIO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">CPF:</span>
                <span class="field-highlight ${data.third?.cpf ? 'filled' : 'empty'}">
                  ${cessionarioCpf || '000.000.000-00'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">RG:</span>
                <span class="field-highlight ${data.third?.rg ? 'filled' : 'empty'}">
                  ${cessionarioRg || 'RG_NUMERO'}
                </span>
              </div>
            </div>
          </div>

          <p class="text-justify indent-6">
            em favor da CONCESSIONÁRIA abaixo especificada:
          </p>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DA CONCESSIONÁRIA
            </h2>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Nome:</span>
                <span class="field-highlight ${data.concessionaria?.name ? 'filled' : 'empty'}">
                  ${concessionaria || 'NOME_CONCESSIONARIA'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">CNPJ:</span>
                <span class="field-highlight ${data.concessionaria?.cnpj ? 'filled' : 'empty'}">
                  ${concessionariaCnpj || '00.000.000/0000-00'}
                </span>
              </div>
            </div>
          </div>

          <p class="text-justify indent-6">
            o valor de (
            <span class="field-highlight ${data.payment?.amount ? 'filled' : 'empty'}">
              R$ ${valor || '0,00'}
            </span>)
          </p>

          <p class="text-justify indent-6">
            Por meio de 
            <span class="field-highlight ${data.payment?.method ? 'filled' : 'empty'}">
              ${formaPagamento || 'FORMA_PAGAMENTO'}
            </span>
          </p>

          <p class="text-justify indent-6">
            realizada junto ao Banco 
            <span class="field-highlight ${data.payment?.bank_name ? 'filled' : 'empty'}">
              ${banco || 'NOME_BANCO'}
            </span>, 
            conta corrente 
            <span class="field-highlight ${data.payment?.account ? 'filled' : 'empty'}">
              ${conta || '00000-0'}
            </span>, 
            agência 
            <span class="field-highlight ${data.payment?.agency ? 'filled' : 'empty'}">
              ${agencia || '0000'}
            </span>, 
            conforme comprovante anexo, pela compra do:
          </p>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DO VEÍCULO
            </h2>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Veículo:</span>
                <span class="field-highlight ${(data.newVehicle?.model || data.usedVehicle?.model) ? 'filled' : 'empty'}">
                  ${veiculoModelo || 'MODELO_VEICULO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Marca:</span>
                <span class="field-highlight ${(data.newVehicle?.brand || data.usedVehicle?.brand) ? 'filled' : 'empty'}">
                  ${veiculoMarca || 'MARCA_VEICULO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Cor:</span>
                <span class="field-highlight ${(data.newVehicle?.color || data.usedVehicle?.color) ? 'filled' : 'empty'}">
                  ${veiculoCor || 'COR_VEICULO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Ano/Mod:</span>
                <span class="field-highlight ${(data.newVehicle?.yearModel || data.usedVehicle?.year) ? 'filled' : 'empty'}">
                  ${veiculoAno || '0000/0000'}
                </span>
              </div>
            </div>
          </div>

          <p class="text-justify indent-6">
            conforme Pedido de Venda Nº 
            <span class="field-highlight ${data.document?.proposal_number ? 'filled' : 'empty'}">
              ${pedidoVenda || '000000'}
            </span>
          </p>

          <div class="mt-8 print:break-inside-avoid">
            <div class="text-center mb-6">
              <p class="text-sm font-semibold">${(data.document?.location || 'CIDADE/UF').toUpperCase()}, <span class="field-highlight filled">${documentDate}</span></p>
            </div>

            <div class="grid md:grid-cols-1 gap-8 items-end">
              <div class="text-center">
                <div class="w-64 mx-auto h-px bg-neutral-700 mb-2"></div>
                <p class="text-xs italic">
                  <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">${cedenteName || 'NOME_CEDENTE'}</span><br/>
                  Assinatura do Cedente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }, [])

  const generateCessaoTemplate = useCallback((data) => {
    const clientName = data.client?.name || ''
    const clientCpf = data.client?.cpf || ''
    const clientRg = data.client?.rg || ''
    const clientAddress = data.client?.address || ''
    
    const thirdName = data.third?.name || ''
    const thirdRg = data.third?.rg || ''
    const thirdCpf = data.third?.cpf || ''
    const thirdAddress = data.third?.address || ''
    
    const usedVehicleBrand = data.usedVehicle?.brand || ''
    const usedVehicleModel = data.usedVehicle?.model || ''
    const usedVehicleChassi = data.usedVehicle?.chassi || ''
    const usedVehicleColor = data.usedVehicle?.color || ''
    const usedVehiclePlate = data.usedVehicle?.plate || ''
    const usedVehicleYear = data.usedVehicle?.year || ''
    const usedVehicleValue = data.usedVehicle?.value || ''
    
    const newVehicleModel = data.newVehicle?.model || ''
    const newVehicleYearModel = data.newVehicle?.yearModel || ''
    const newVehicleChassi = data.newVehicle?.chassi || ''
    
    const documentDate = data.document?.date || new Date().toLocaleDateString('pt-BR')

    return `
      <div class="max-w-[800px] mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm print:shadow-none print:p-0">
        <h1 class="text-center text-base md:text-lg font-bold tracking-wide uppercase mb-6 text-neutral-800">
          TERMO DE DECLARAÇÃO DE CESSÃO DE CRÉDITO EM FAVOR DE TERCEIROS E OUTRAS AVENÇAS
        </h1>
        
        <div class="space-y-3 text-[13px] leading-6 text-neutral-800">
          <p class="text-justify indent-6">
            Eu, <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">${clientName || 'NOME_CLIENTE'}</span>, 
            portador (a) do RG nº <span class="field-highlight ${data.client?.rg ? 'filled' : 'empty'}">${clientRg || 'RG_NUMERO'}</span> 
            e inscrito(a) no CPF sob o nº <span class="field-highlight ${data.client?.cpf ? 'filled' : 'empty'}">${clientCpf || '000.000.000-00'}</span>, 
            residente e domiciliado (a) <span class="field-highlight ${data.client?.address ? 'filled' : 'empty'}">${clientAddress || 'ENDERECO_COMPLETO'}</span> 
            (doravante denominado <strong>CEDENTE DO CRÉDITO</strong>), proprietário (a) do veículo:
          </p>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DO VEÍCULO VENDIDO
            </h2>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Marca:</span>
                <span class="field-highlight ${data.usedVehicle?.brand ? 'filled' : 'empty'}">
                  ${usedVehicleBrand || 'MARCA'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Modelo:</span>
                <span class="field-highlight ${data.usedVehicle?.model ? 'filled' : 'empty'} break-words hyphens-auto">
                  ${usedVehicleModel || 'MODELO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Chassi:</span>
                <span class="field-highlight ${data.usedVehicle?.chassi ? 'filled' : 'empty'} break-words">
                  ${usedVehicleChassi || 'CHASSI'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Cor:</span>
                <span class="field-highlight ${data.usedVehicle?.color ? 'filled' : 'empty'}">
                  ${usedVehicleColor || 'COR'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Placa:</span>
                <span class="field-highlight ${data.usedVehicle?.plate ? 'filled' : 'empty'}">
                  ${usedVehiclePlate || 'ABC-0000'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Ano/Modelo:</span>
                <span class="field-highlight ${data.usedVehicle?.year ? 'filled' : 'empty'}">
                  ${usedVehicleYear || '0000/0000'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Valor:</span>
                <span class="field-highlight ${data.usedVehicle?.value ? 'filled' : 'empty'}">
                  R$ ${usedVehicleValue || '0,00'}
                </span>
              </div>
            </div>
          </div>

          <p class="text-justify indent-6">
            (doravante denominado <strong>VEÍCULO VENDIDO</strong>), declaro ter vendido à 
            <strong>(CONCESSIONÁRIA)</strong>, pessoa jurídica de direito privado, devidamente inscrita no CNPJ/MF 
            sob nº <span class="field-highlight filled">60.894.136/0004-67</span>, estabelecida em 
            <span class="field-highlight filled">AVENIDA DEPUTADO BENEDITO MATARAZZO, 5051, BAIRRO PQ. RES. AQUARIUS, CEP nº 12246-840 Cidade de SÃO JOSÉ DOS CAMPOS-SP</span>. 
            (doravante denominada <strong>CONCESSIONÁRIA</strong>), o <strong>VEÍCULO VENDIDO</strong> 
            pelo valor de <span class="field-highlight ${data.usedVehicle?.value ? 'filled' : 'empty'}">R$ ${usedVehicleValue || '0,00'}</span>
          </p>

          <p class="text-justify indent-6">
            autorizando a utilização da importância de <span class="field-highlight ${data.usedVehicle?.value ? 'filled' : 'empty'}">R$ ${usedVehicleValue || '0,00'}</span>
            para pagamento de parte do valor do veículo:
          </p>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DADOS DO VEÍCULO NOVO
            </h2>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Modelo:</span>
                <span class="field-highlight ${data.newVehicle?.model ? 'filled' : 'empty'} break-words hyphens-auto">
                  ${newVehicleModel || 'MODELO_NOVO'}
                </span>
              </div>
              <div class="flex gap-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Ano/Modelo:</span>
                <span class="field-highlight ${data.newVehicle?.yearModel ? 'filled' : 'empty'}">
                  ${newVehicleYearModel || '0000/0000'}
                </span>
              </div>
              <div class="flex gap-2 md:col-span-2">
                <span class="font-semibold min-w-[80px] text-sm text-neutral-700">Chassi nº:</span>
                <span class="field-highlight ${data.newVehicle?.chassi ? 'filled' : 'empty'} break-words">
                  ${newVehicleChassi || 'CHASSI_NOVO'}
                </span>
              </div>
            </div>
          </div>

          <p class="text-justify indent-6">
            adquirido por <span class="field-highlight ${data.third?.name ? 'filled' : 'empty'}">${thirdName || 'NOME_TERCEIRO'}</span>, 
            portador (a) do RG nº <span class="field-highlight ${data.third?.rg ? 'filled' : 'empty'}">${thirdRg || 'RG_TERCEIRO'}</span> 
            e inscrito(a) no CPF sob o nº <span class="field-highlight ${data.third?.cpf ? 'filled' : 'empty'}">${thirdCpf || '000.000.000-00'}</span>, 
            residente e domiciliado (a) <span class="field-highlight ${data.third?.address ? 'filled' : 'empty'}">${thirdAddress || 'ENDERECO_TERCEIRO'}</span> 
            (doravante denominado <strong>CESSIONÁRIO DO CRÉDITO</strong>)
          </p>

          <div class="mt-6 mb-4">
            <h2 class="text-sm font-semibold uppercase mb-3 pb-2 border-b border-neutral-300">
              DECLARAÇÕES E RESPONSABILIDADES
            </h2>
            <p class="text-justify indent-6">
              Declara, por fim, de livre e espontânea vontade, sem qualquer induzimento, 
              coação, simulação, lesão, reserva mental e/ou qualquer outra modalidade de 
              vício do consentimento, sob as penas da lei, a quem possa interessar e para todos 
              os fins de direito, responsabilizando-me civil, administrativa e criminalmente pela 
              presente declaração, que estas transações não prejudicam terceiros a qualquer 
              título, respondendo, a qualquer tempo, por eventual indenização.
            </p>

            <p class="text-justify indent-6">
              Por ser expressão da verdade firmo a presente declaração na presença das 
              testemunhas abaixo, que validam como bom, firme e valioso o presente ato.
            </p>
          </div>

          <div class="mt-8 print:break-inside-avoid">
            <div class="text-center mb-6">
              <p class="text-sm font-semibold">SÃO JOSÉ DOS CAMPOS, <span class="field-highlight filled">${documentDate}</span></p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 items-end">
              <div class="text-center">
                <div class="w-56 mx-auto h-px bg-neutral-700 mb-2"></div>
                <p class="text-xs italic">
                  Cedente do Crédito<br/>
                  Nome: <span class="field-highlight ${data.client?.name ? 'filled' : 'empty'}">${clientName || 'NOME_CLIENTE'}</span>
                </p>
              </div>

              <div class="text-center">
                <div class="w-56 mx-auto h-px bg-neutral-700 mb-2"></div>
                <p class="text-xs italic">
                  Cessionário do Crédito<br/>
                  Nome: <span class="field-highlight ${data.third?.name ? 'filled' : 'empty'}">${thirdName || 'NOME_TERCEIRO'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }, [])

  const fetchTemplatePreview = useCallback(async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiRequest('POST', `/api/documents/templates/${templateType}/preview`, {
        extracted_data: data || {}
      })
      const result = await response.json()
      if (result?.success && result?.data?.html) {
        return result.data.html
      }
      throw new Error(result?.message || 'Falha ao gerar preview do template')
    } catch (e) {
      setError(e?.message || 'Erro ao carregar preview')
      return ''
    } finally {
      setIsLoading(false)
    }
  }, [templateType])

  const generatePreview = useCallback(async () => {
    // CKDEV-NOTE: For templates with pagination, use local generator to ensure proper page switching
    if (templateType === 'responsabilidade_veiculo') {
      const templates = {
        'responsabilidade_veiculo': generateResponsabilidadeTemplate,
        'pagamento_terceiro': generatePagamentoTerceiroTemplate,
        'cessao_credito': generateCessaoTemplate
      }
      const generator = templates[templateType]
      
      if (generator) {
        const result = generator(formData || {})
        if (typeof result === 'object' && result.page1 && result.page2) {
          // Template com paginação
          const pages = [result.page1, result.page2]
          const currentPageHtml = pages[currentPage - 1] || result.page1
          setPreviewHtml(currentPageHtml)
        } else {
          // Template sem paginação
          setPreviewHtml(result)
        }
      } else {
        setError('Tipo de template não suportado')
      }
      return
    }
    
    // CKDEV-NOTE: Try backend preview first for non-paginated templates; fallback to local generator
    if (templateType) {
      try {
        const html = await fetchTemplatePreview(formData || {})
        if (html) {
          setPreviewHtml(html)
          return
        }
      } catch (error) {
      }
    }
    
    // CKDEV-NOTE: Fallback to local template generator
    const templates = {
      'responsabilidade_veiculo': generateResponsabilidadeTemplate,
      'pagamento_terceiro': generatePagamentoTerceiroTemplate,
      'cessao_credito': generateCessaoTemplate
    }
    const generator = templates[templateType]
    
    if (generator) {
      const result = generator(formData || {})
      if (typeof result === 'object' && result.page1 && result.page2) {
        // Template com paginação
        const pages = [result.page1, result.page2]
        const currentPageHtml = pages[currentPage - 1] || result.page1
        setPreviewHtml(currentPageHtml)
      } else {
        // Template sem paginação
        setPreviewHtml(result)
      }
    } else {
      setError('Tipo de template não suportado')
    }
  }, [templateType, formData, currentPage, fetchTemplatePreview])

  useEffect(() => {
    generatePreview()
  }, [generatePreview])

  useEffect(() => {
    if (templateType === 'responsabilidade_veiculo') {
      generatePreview()
    }
  }, [currentPage, templateType])

  return (
    <div className="relative h-full flex flex-col">
      {/* CKDEV-NOTE: Compact controls with reduced spacing */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        {/* Paginação para templates com múltiplas páginas */}
        {templateType === 'responsabilidade_veiculo' && (
          <div className="flex items-center min-w-[300px]">
            <Pagination className="w-full">
              <PaginationContent className="w-full justify-center space-x-2">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} min-w-[80px] h-10`}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="cursor-pointer min-w-[40px] h-10"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    isActive={currentPage === 2}
                    onClick={() => setCurrentPage(2)}
                    className="cursor-pointer min-w-[40px] h-10"
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(2, prev + 1))}
                    className={`${currentPage === 2 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} min-w-[80px] h-10`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        {/* Controles de zoom */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleZoomOut}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            disabled={currentZoom <= 50}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs text-gray-600 min-w-[50px] text-center">
            {currentZoom}%
          </span>
          <Button
            onClick={handleZoomIn}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            disabled={currentZoom >= 200}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* CKDEV-NOTE: Full height document container with proper flex layout */}
      <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-auto flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="zoom-transform"
          style={{ 
            transform: `scale(${currentZoom/100})`,
            transformOrigin: 'top left',
            width: `${100 / (currentZoom/100)}%`,
            height: 'fit-content',
            minWidth: '100%'
          }}
        >
          {isLoading ? (
            <div className="p-6 text-center text-gray-600 text-sm">Gerando preview...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 text-sm">{error}</div>
          ) : (
            // CKDEV-NOTE: Render modern template for vehicle data demonstration
            templateType === 'responsabilidade_veiculo' && currentPage === 2 ? 
              renderModernVehicleDataTemplate() : 
              renderModernTemplateContent()
          )}
        </motion.div>
      </div>
      
      <style jsx global>{`
        .zoom-transform {
          max-width: 100%;
          padding: 0.5rem;
          width: 100%;
        }
        
        .app-document-container {
          max-width: 100% !important;
          padding: 0.25rem !important;
          width: 100% !important;
        }
        
        /* CKDEV-NOTE: Force consistent width for page 2 container to match page 1 */
        .max-w-\\[800px\\] {
          width: 510px !important;
          max-width: 800px !important;
        }
        
        .field-highlight {
          display: inline;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          border: 1px solid;
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1.3;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          margin: 0 1px;
          vertical-align: baseline;
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
        }
        
        /* CKDEV-NOTE: Block field variant used in preview grid to center and equalize fields */
        .field-block .field-highlight {
          width: auto;
          max-width: calc(100% - 8px);
          justify-content: center;
          text-align: center;
          padding: 0.1rem 0.3rem;
          font-size: 0.65rem;
          letter-spacing: -0.01em;
        }
        
        .field-highlight.filled {
          background: rgb(240 253 244);
          border-color: rgb(187 247 208);
          color: rgb(22 101 52);
        }
        
        .field-highlight.empty {
          background: linear-gradient(135deg, rgb(254 226 226) 0%, rgb(252 165 165) 100%);
          border-color: rgb(239 68 68);
          color: rgb(127 29 29);
          animation: pulse 2s infinite;
        }
        
        /* CKDEV-NOTE: Even more compact styling for template document fields - with line breaks */
        .template-document .field-highlight {
          padding: 0.05rem 0.15rem;
          margin: 0 0.05rem;
          font-size: 0.75rem;
          border-radius: 0.15rem;
          display: inline;
          vertical-align: baseline;
          line-height: 1.4;
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
        }
        
        .template-document .field-highlight.filled {
          background: rgb(240 253 244);
          border: 1px solid rgb(187 247 208);
          color: rgb(22 101 52);
        }
        
        .template-document .field-highlight.empty {
          background: rgb(254 226 226);
          border: 1px solid rgb(239 68 68);
          color: rgb(127 29 29);
        }
        
        .field-highlight:hover {
          transform: none;
          box-shadow: none;
        }
        
        .info-section {
          margin: 1rem 0;
          padding: 0.75rem;
          border-left: 4px solid #3b82f6;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          padding-bottom: 0.375rem;
          border-bottom: 2px solid #e2e8f0;
          color: #374151;
          letter-spacing: 0.05em;
        }
        
        .info-row {
          display: grid;
          grid-template-columns: minmax(100px, 1fr) 2fr;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          align-items: start;
        }
        
        .info-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.75rem;
        }
        
        .info-value {
          word-break: break-words;
          hyphens: auto;
        }
        
        .declaration-text {
          text-align: justify;
          text-indent: 1.5rem;
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.02);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .template-preview-html {
          animation: fadeIn 0.3s ease-out;
          min-height: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        /* CKDEV-NOTE: Styles for document template structure - maximized width usage */
        .template-document {
          width: 100%;
          max-width: 95%;
          margin: 0 auto;
          padding: 0.5rem;
        }
        
        .document-content {
          background: white;
          padding: 1.5rem 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
        }
        
        /* CKDEV-NOTE: Paragraph styling for template content - optimized spacing */
        .paragraph {
          margin-bottom: 0.8rem;
          line-height: 1.5;
          color: #374151;
          text-align: justify;
          text-indent: 1.5rem;
          font-size: 0.9rem;
        }
        
        /* CKDEV-NOTE: Compact field highlights within paragraphs */
        .paragraph .field-highlight {
          padding: 0.08rem 0.2rem;
          margin: 0;
          font-size: 0.75rem;
          border-radius: 0.2rem;
          vertical-align: baseline;
          line-height: inherit;
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
        }
        
        /* CKDEV-NOTE: First paragraph as title - centered and bold */
        .paragraph:first-child {
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          text-indent: 0;
          font-size: 1rem;
          letter-spacing: 0.025em;
          line-height: 1.3;
        }
        
        @media print {
          .zoom-transform {
            transform: none !important;
          }
          
          .field-highlight {
            background: transparent !important;
            border: 1px solid #333 !important;
            color: #000 !important;
            box-shadow: none !important;
          }
          
          .info-section {
            background: transparent !important;
            border-left: 2px solid #000 !important;
            box-shadow: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
        }
        
        @media (max-width: 768px) {
          .info-row {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
          
          .field-block {
            height: 40px !important;
          }
          
          .field-block .field-highlight {
            padding: 0.15rem 0.3rem;
            font-size: 0.65rem;
          }
          
          .grid {
            gap: 0.25rem !important;
          }
          
          .p-2\\.5 {
            padding: 0.375rem !important;
          }
        }
        
        @media (max-width: 640px) {
          .field-block {
            min-height: 32px !important;
            flex-direction: row !important;
            padding: 0.25rem !important;
            gap: 0.5rem !important;
          }
          
          .field-block .field-highlight {
            padding: 0.05rem 0.2rem;
            font-size: 0.55rem;
          }
          
          .field-block > div:first-child {
            width: auto !important;
            min-width: 60px;
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  )
}