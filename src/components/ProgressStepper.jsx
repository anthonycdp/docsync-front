import React from 'react'
import { Upload, Settings, Eye, Download } from 'lucide-react'

const WORKFLOW_STEPS = [
  {
    id: 'upload',
    label: 'Upload',
    description: 'Selecione e envie',
    icon: Upload
  },
  {
    id: 'processing',
    label: 'Processamento',
    description: 'Extraindo dados',
    icon: Settings
  },
  {
    id: 'review',
    label: 'Revisão',
    description: 'Validar informações', 
    icon: Eye
  },
  {
    id: 'download',
    label: 'Download',
    description: 'Documentos prontos',
    icon: Download
  }
]

function ProgressStepper({ currentStep = 'upload' }) {
  const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.id === currentStep)
  
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'active'
    return 'pending'
  }

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return {
          container: 'text-green-600',
          circle: 'bg-green-100 border-green-300',
          icon: 'text-green-600',
          label: 'text-green-600',
          description: 'text-green-500'
        }
      case 'active':
        return {
          container: 'text-blue-600',
          circle: 'bg-blue-100 border-blue-400',
          icon: 'text-blue-600',
          label: 'text-blue-600',
          description: 'text-blue-500'
        }
      case 'pending':
      default:
        return {
          container: 'text-gray-400',
          circle: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-400',
          label: 'text-gray-400',
          description: 'text-gray-400'
        }
    }
  }

  const getConnectorClasses = (stepIndex) => {
    if (stepIndex < currentStepIndex) {
      return 'bg-green-300'
    } else if (stepIndex === currentStepIndex) {
      return 'bg-gradient-to-r from-blue-300 to-gray-200'
    }
    return 'bg-gray-200'
  }

  return (
            <div className="w-full max-w-app-container 2xl:max-w-app-container-xl mx-auto py-2" data-testid="progress-stepper">
      <div className="relative bg-gradient-to-r from-blue-50/40 via-white to-purple-50/40 rounded-xl p-4 border border-gray-200/60 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between relative">
          {WORKFLOW_STEPS.map((step, index) => {
            const status = getStepStatus(index)
            const classes = getStepClasses(status)
            const IconComponent = step.icon
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle and Content */}
                <div className="flex flex-col items-center relative z-10">
                  {/* Circle with Icon */}
                  <div className={`relative w-12 h-12 rounded-xl border-2 flex items-center justify-center ${
                    status === 'completed' 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 shadow-md shadow-emerald-200/50'
                      : status === 'active' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-200/60'
                        : 'bg-white border-gray-300 shadow-sm'
                  }`}>
                    {status === 'completed' ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <IconComponent className={`w-5 h-5 ${
                        status === 'active' ? 'text-white' : 'text-gray-400'
                      }`} />
                    )}
                    
                    {/* Glow effect for active step */}
                    {status === 'active' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 opacity-30 blur-lg animate-pulse" />
                    )}
                  </div>
                  
                  {/* Labels */}
                  <div className="text-center mt-2 min-w-[80px]">
                    <p className={`text-xs font-bold ${
                      status === 'completed' ? 'text-emerald-700'
                      : status === 'active' ? 'text-blue-700'
                      : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-1 font-medium ${
                      status === 'completed' ? 'text-emerald-600'
                      : status === 'active' ? 'text-blue-600'
                      : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="flex-1 relative mx-4">
                    <div className={`h-0.5 w-full rounded-full transition-all duration-700 ${
                      index < currentStepIndex 
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm'
                        : index === currentStepIndex 
                          ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-gray-300'
                          : 'bg-gray-200'
                    }`} />
                    
                    {/* Animated progress dot */}
                    {index === currentStepIndex && (
                      <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full shadow-md transform -translate-y-1/2 animate-bounce" 
                           style={{ left: '60%' }} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-xl" />
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-xl" />
      </div>
    </div>
  )
}

export default ProgressStepper