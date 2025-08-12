import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export default function ModernVehicleDataTemplate() {
  return (
    <div className="px-4 max-w-app-container mx-auto">
      <Card className="shadow-sm mb-4">
        <CardContent className="p-6">
          <div className="max-w-app-content mx-auto bg-white rounded-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold tracking-wide uppercase text-neutral-800 mb-2">
                DADOS DO VEÍCULO USADO
              </h1>
              <Separator className="w-24 mx-auto" />
            </div>
            
            <div className="space-y-8">
              {/* Vehicle Specifications */}
              <Card className="border-0 shadow-none bg-gray-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase text-neutral-700 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">1</Badge>
                    ESPECIFICAÇÕES DO VEÍCULO
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Marca
                      </Badge>
                      <span className="field-highlight filled break-words hyphens-auto font-medium">
                        CHEVROLET
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Modelo
                      </Badge>
                      <span className="field-highlight filled break-words hyphens-auto font-medium">
                        TRACKER 1.2 TURBO
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Ano/Modelo
                      </Badge>
                      <span className="field-highlight filled font-medium">
                        2023/2024
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Cor
                      </Badge>
                      <span className="field-highlight filled font-medium">
                        PRETO
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Placa
                      </Badge>
                      <span className="field-highlight filled font-medium">
                        SIS4F64
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Chassi
                      </Badge>
                      <span className="field-highlight filled break-words font-medium">
                        9BGEP76B0RB161637
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Valor
                      </Badge>
                      <span className="field-highlight filled font-medium text-lg">
                        R$ 104.000,00
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Data */}
              <Card className="border-0 shadow-none bg-gray-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase text-neutral-700 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">2</Badge>
                    DADOS DO CLIENTE
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        Nome
                      </Badge>
                      <span className="field-highlight filled font-medium">
                        DANIEL CONTRERAS MARASCA
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        CPF
                      </Badge>
                      <span className="field-highlight filled font-medium">
                        429.867.938-19
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center">
                        RG
                      </Badge>
                      <span className="field-highlight filled font-medium">
                        35.707.521
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
                      <Badge variant="secondary" className="text-xs font-medium min-w-[80px] justify-center mt-1">
                        Endereço
                      </Badge>
                      <span className="field-highlight filled break-words font-medium">
                        RUA SAO DIEGO, 97, CEP 12246-840, JACAREI - SP
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="mt-12 print:break-inside-avoid">
                <div className="text-center">
                  <Card className="border-0 shadow-none bg-blue-50/50">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold text-neutral-700">
                        CPF nº: <span className="field-highlight filled font-bold">429.867.938-19</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <style jsx>{`
                              .field-highlight {
                        display: inline-block;
                        padding: 0.25rem 0.5rem;
                        border-radius: 0.375rem;
                        border: 1px solid;
                        font-size: 0.875rem;
                        font-weight: 500;
                        vertical-align: baseline;
                        margin: 0 0.125rem;
                        transition: all 0.2s ease;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                      }
        
                              .field-highlight.filled {
                        background: linear-gradient(135deg, rgb(220 252 231) 0%, rgb(187 247 208) 100%);
                        border-color: rgb(134 239 172);
                        color: rgb(22 101 52);
                      }
        
        .field-highlight:hover {
          transform: none;
          box-shadow: none;
        }
        
                              @media print {
                        .field-highlight {
                          background: transparent !important;
                          border: 1px solid #333 !important;
                          color: #000 !important;
                          box-shadow: none !important;
                        }
                      }
        
                              @media (max-width: 768px) {
                        .field-highlight {
                          padding: 0.375rem 0.625rem;
                          font-size: 0.8125rem;
                        }
                      }
      `}</style>
    </div>
  )
}
