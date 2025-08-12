import React from 'react';
import { ScrollArea } from './ui/scroll-area';

export function MainContent() {
  return (
    <main className="flex-1 w-full overflow-hidden">
      <div className="max-w-app-container 2xl:max-w-app-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* CKDEV-NOTE: Header section with back button */}
          <div className="flex-shrink-0">
            <button className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground flex items-center gap-2 px-4 py-2 h-9 rounded-lg border border-gray-200 hover:border-gray-300 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 shadow-sm hover:shadow-md transition-all duration-200 group" 
              aria-label="Voltar ao Início">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-4 h-4 group-hover:scale-110 transition-transform duration-200">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <span className="font-medium text-sm">Voltar ao Início</span>
            </button>
          </div>

          {/* CKDEV-NOTE: Title badge section */}
          <div className="flex-shrink-0">
            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-100 hover:bg-gray-200 text-lg font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 shadow-lg px-6 py-3">
                📄 Termo de Responsabilidade - Veículos Usados
              </div>
            </div>
          </div>

          {/* CKDEV-NOTE: Main upload card with ScrollArea for content overflow */}
          <div className="flex-1">
            <div className="rounded-lg bg-white text-gray-900 border-2 border-gray-100/80 shadow-2xl bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 backdrop-blur-sm overflow-hidden">
              <div className="flex flex-col space-y-1.5 p-6 pb-6 bg-gradient-to-r from-blue-50/40 via-white to-purple-50/40 border-b border-gray-100/60">
                <h3 className="font-semibold tracking-tight flex items-center justify-between text-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-5 h-5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" x2="12" y1="3" y2="15"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Upload</h3>
                      <p className="text-sm text-gray-600 font-normal mt-0.5">Documento de responsabilidade sobre veículo usado</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-gray-200 px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-600 border-gray-200">
                      0/1
                    </div>
                  </div>
                </h3>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-6 p-4">
                  {/* CKDEV-NOTE: Upload dropzone area */}
                  <div className="flex-1">
                    <div role="presentation" tabIndex={0} className="
                      relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden group
                      border-gray-300 hover:border-gray-400 hover:bg-gray-50
                      flex flex-col justify-center min-h-[250px]
                    ">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      <input 
                        accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png" 
                        tabIndex={-1} 
                        type="file" 
                        style={{ 
                          border: 0, 
                          clip: 'rect(0px, 0px, 0px, 0px)', 
                          clipPath: 'inset(50%)', 
                          height: 1, 
                          margin: '0px -1px -1px 0px', 
                          overflow: 'hidden', 
                          padding: 0, 
                          position: 'absolute', 
                          width: 1, 
                          whiteSpace: 'nowrap' 
                        }} 
                      />
                      
                      <div className="relative z-10">
                        <div className="w-12 h-12 mx-auto mb-4 p-3 rounded-xl transition-all duration-300 bg-gray-100 group-hover:bg-blue-50 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-full h-full transition-colors duration-300 text-gray-500 group-hover:text-blue-600">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" x2="12" y1="3" y2="15"></line>
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                          📤 Arraste arquivos aqui ou clique para selecionar
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-gray-600 font-medium group-hover:text-blue-700 transition-colors">
                            Arquivo único • PDF, JPG, PNG (máx. 10MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CKDEV-NOTE: File requirements info card */}
                  <div className="relative p-4 bg-gradient-to-r from-blue-50/60 via-white to-purple-50/60 rounded-xl border-2 border-blue-100/50 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <div className="p-1 bg-blue-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-3 h-3 text-white">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                          <path d="M10 9H8"></path>
                          <path d="M16 13H8"></path>
                          <path d="M16 17H8"></path>
                        </svg>
                      </div>
                      Arquivos Necessários:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-100 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-2 py-1 text-xs font-semibold transition-all duration-200 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                            Proposta PDF (Documento da Proposta)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-100/50 rounded-lg border border-blue-200/50">
                      <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        Aceita: PDF, JPG, PNG • Máx. 10MB por arquivo
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}