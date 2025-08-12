import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Loader2, CheckCircle, AlertCircle, Clock, FileSearch, Brain, Zap, X, ArrowLeft, Upload } from 'lucide-react'
import BackToHomeButton from './BackToHomeButton'
import { usePageScroll } from '../hooks/use-scroll-to-focus'

const ProcessingStatus = ({ progress, isProcessing, onCancel, onGoBack, showActions = true, templateName, onBackToHome }) => {
  const [isCanceling, setIsCanceling] = React.useState(false)
  
  // CKDEV-NOTE: Ref para o elemento de foco principal (barra de progresso)
  const progressRef = React.useRef(null)
  
  // CKDEV-NOTE: Scroll inteligente que centraliza a barra de progresso
  usePageScroll(progressRef, 'processing')
  
  const getProcessingStep = () => {
    if (progress < 30) return { icon: FileSearch, text: 'Analisando documentos...', color: 'text-blue-600', bgColor: 'from-blue-500 to-blue-600' }
    if (progress < 60) return { icon: Brain, text: 'Extraindo informações...', color: 'text-purple-600', bgColor: 'from-purple-500 to-purple-600' }
    if (progress < 90) return { icon: Zap, text: 'Validando dados...', color: 'text-orange-600', bgColor: 'from-orange-500 to-orange-600' }
    return { icon: CheckCircle, text: 'Finalizando processamento...', color: 'text-green-600', bgColor: 'from-green-500 to-green-600' }
  }

  const currentStep = getProcessingStep()
  const StepIcon = currentStep.icon

  return (
    <div className="w-full">
      {/* Modern Progress Container */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/60 overflow-hidden group hover:shadow-2xl transition-all duration-500 mb-6">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500" />
        
        {/* Header with title and progress */}
        <div className="relative z-10 mb-6">
                      <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold tracking-tight flex items-center space-x-2 text-lg group-hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Assistente de Upload de Documentos
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {onBackToHome && <BackToHomeButton onBackToHome={onBackToHome} />}
              </div>
            </div>
          
          {/* Progress Bar */}
          <div ref={progressRef} className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Progresso do Processamento</span>
              <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Current Step Status */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-xl border border-gray-200/60">
            <motion.div
              animate={{ rotate: isProcessing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
              className={`w-12 h-12 bg-gradient-to-br ${currentStep.bgColor} rounded-full flex items-center justify-center shadow-lg`}
            >
              {progress >= 100 ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <StepIcon className="w-6 h-6 text-white" />
              )}
            </motion.div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">
                {progress >= 100 ? 'Processamento Concluído!' : currentStep.text}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {progress >= 100 ? 'Dados extraídos e validados com sucesso' : `${Math.floor(progress)}% concluído`}
              </p>
            </div>
            {progress >= 100 && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
        </div>

        {/* Processing Steps */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 gap-3">
            {[
              { step: 'Análise de Documentos', threshold: 30, icon: FileSearch, color: 'from-blue-500 to-blue-600' },
              { step: 'Extração de Dados', threshold: 60, icon: Brain, color: 'from-purple-500 to-purple-600' },
              { step: 'Validação', threshold: 90, icon: Zap, color: 'from-orange-500 to-orange-600' },
              { step: 'Finalização', threshold: 100, icon: CheckCircle, color: 'from-green-500 to-green-600' }
            ].map((item, index) => {
              const isCompleted = progress >= item.threshold
              const isActive = progress >= (index > 0 ? [30, 60, 90, 100][index - 1] : 0) && progress < item.threshold
              const StepIcon = item.icon

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group/step cursor-pointer ${
                    isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm' : 
                    isActive ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 shadow-md' : 
                    'bg-gray-50/60 border border-gray-200/40 hover:bg-gray-100/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover/step:scale-110 ${
                    isCompleted ? `bg-gradient-to-br ${item.color} shadow-lg` : 
                    isActive ? `bg-gradient-to-br ${item.color} shadow-lg ring-2 ring-blue-200` : 
                    'bg-gray-100 shadow-sm'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5 text-white" />
                      </motion.div>
                    ) : (
                      <StepIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                      isCompleted ? 'text-green-700' : 
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {item.step}
                    </span>
                    <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                      isCompleted ? 'text-green-600' : 
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {isCompleted ? 'Concluído' : isActive ? 'Em andamento...' : 'Aguardando'}
                    </p>
                  </div>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      ✓
                    </Badge>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Success Message */}
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg mb-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-green-800 text-lg">
                Processamento concluído com sucesso!
              </span>
              <p className="text-sm text-green-700 mt-1">
                Os dados foram extraídos e estão prontos para revisão.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center pt-6 border-t border-gray-200/60"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {onGoBack && (
              <Button
                variant="outline"
                size="lg"
                onClick={onGoBack}
                className="flex items-center justify-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex-1 sm:flex-initial"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Voltar</span>
              </Button>
            )}
            
            {progress < 100 && onCancel && (
              <Button
                variant="destructive"
                size="lg"
                onClick={() => {
                  setIsCanceling(true)
                  onCancel()
                }}
                disabled={!isProcessing || isCanceling}
                className="flex items-center justify-center gap-2 sm:ml-auto bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-red-300 disabled:border-red-300 disabled:shadow-none active:scale-[0.98] disabled:active:scale-100 flex-1 sm:flex-initial"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-medium">Cancelando...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span className="font-medium">Cancelar Processamento</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProcessingStatus