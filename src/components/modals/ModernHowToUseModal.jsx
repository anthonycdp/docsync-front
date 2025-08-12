import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SimpleModal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter
} from "../ui/simple-modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";
import { 
  Upload, 
  FileSearch, 
  CheckCircle2, 
  Download,
  ArrowRight,
  PlayCircle,
  Clock,
  Star,
  Zap,
  Shield,
  Target,
  ArrowLeft,
  RotateCcw
} from "lucide-react";

export default function ModernHowToUseModal({ open, onOpenChange }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Escolha o Template",
      icon: Target,
      duration: "30s",
      description: "Selecione o tipo de documento jurídico",
      gradient: "from-blue-500 to-purple-600",
      steps: [
        "Navegue pelos templates na tela inicial",
        "Leia a descrição de cada template",
        "Verifique os documentos necessários",
        "Clique no card do template desejado"
      ],
      tip: "Certifique-se de ter todos os documentos antes de começar.",
      illustration: "🎯"
    },
    {
      id: 1,
      title: "Upload dos Arquivos",
      icon: Upload,
      duration: "1min",
      description: "Envie os documentos necessários",
      gradient: "from-green-500 to-emerald-600",
      steps: [
        "Arraste arquivos ou clique para selecionar",
        "Verifique o formato (PDF, JPG, PNG)",
        "Aguarde confirmação do upload",
        "Prossiga quando todos estiverem carregados"
      ],
      tip: "PDFs de boa qualidade garantem melhor extração.",
      illustration: "📄"
    },
    {
      id: 2,
      title: "Processamento IA",
      icon: FileSearch,
      duration: "2-3min",
      description: "IA extrai dados automaticamente",
      gradient: "from-orange-500 to-red-600",
      steps: [
        "OCR lê o conteúdo dos documentos",
        "IA identifica informações relevantes",
        "Dados são validados automaticamente",
        "Progresso é exibido em tempo real"
      ],
      tip: "Tempo varia conforme complexidade dos documentos.",
      illustration: "🤖"
    },
    {
      id: 3,
      title: "Revisão dos Dados",
      icon: CheckCircle2,
      duration: "1-2min",
      description: "Verifique e corrija se necessário",
      gradient: "from-cyan-500 to-blue-600",
      steps: [
        "Dados são exibidos em formulário",
        "Campos com avisos são destacados",
        "Edite qualquer campo diretamente",
        "Clique em 'Gerar Documentos'"
      ],
      tip: "Revise cuidadosamente dados sensíveis.",
      illustration: "✅"
    },
    {
      id: 4,
      title: "Download Final",
      icon: Download,
      duration: "Instantâneo",
      description: "Documento pronto para download",
      gradient: "from-purple-500 to-pink-600",
      steps: [
        "Escolha o formato (DOCX ou PDF)",
        "Clique no botão de download",
        "Documento é baixado preenchido",
        "Processe novos documentos"
      ],
      tip: "Documentos são removidos após 24h por segurança.",
      illustration: "⬇️"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <SimpleModal open={open} onOpenChange={onOpenChange} size="xl" className="max-h-[85vh]">
      <ModalContent className="flex flex-col max-h-[85vh] overflow-hidden">
        <ModalHeader 
          gradient={`bg-gradient-to-r ${currentStepData.gradient}/90`}
          className="shrink-0"
        >
          <ModalTitle>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <PlayCircle className="w-6 h-6" />
            </div>
            Como Usar o DocSync
          </ModalTitle>
          <ModalDescription>
            Tutorial passo a passo - {steps.length} etapas simples
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Progress Header */}
          <div className="px-4 pt-3 pb-2 bg-white/95 shrink-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <span className="text-sm">{currentStepData.illustration}</span>
                  <span>Passo {currentStep + 1} de {steps.length}</span>
                </div>
                <Badge className={`bg-gradient-to-r ${currentStepData.gradient} text-white border-0 px-2 py-0.5 text-xs`}>
                  <Clock className="w-2.5 h-2.5 mr-1" />
                  {currentStepData.duration}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <Progress value={progressPercentage} className="h-1.5" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progresso</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 py-2 bg-white/95 border-b border-gray-200 shrink-0">
            <div className="flex justify-center gap-1 overflow-x-auto">
              {steps.map((step, idx) => (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  className={`relative px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    idx === currentStep 
                      ? `bg-gradient-to-r ${step.gradient} text-white shadow-sm`
                      : idx < currentStep 
                      ? "bg-green-100 text-green-700 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Ir para ${step.title}`}
                >
                  <div className="flex items-center gap-1">
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="hidden sm:inline text-xs">{step.title}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="flex-1 overflow-y-auto bg-white/95 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-3"
              >
                <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/30">
                  <CardContent className="p-4 space-y-3">
                    {/* Step Header */}
                    <div className="text-center space-y-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${currentStepData.gradient} rounded-xl flex items-center justify-center mx-auto shadow-md`}>
                        <currentStepData.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{currentStepData.title}</h3>
                        <p className="text-gray-600 text-xs mt-0.5">{currentStepData.description}</p>
                      </div>
                    </div>

                    {/* Step Instructions */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-center text-xs">Como fazer:</h4>
                      <div className="grid gap-1.5">
                        {currentStepData.steps.map((stepText, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-2 p-2 rounded-md bg-white/60 border border-gray-100"
                          >
                            <div className={`w-4 h-4 bg-gradient-to-br ${currentStepData.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <span className="text-white font-bold text-xs">{idx + 1}</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {stepText}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50/50 rounded-lg p-2">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md flex items-center justify-center flex-shrink-0">
                          <Star className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-amber-800 text-xs mb-0.5">💡 Dica</h4>
                          <p className="text-xs text-amber-700 leading-tight">
                            {currentStepData.tip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ModalFooter className="shrink-0 border-t bg-white/95">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep === steps.length - 1 ? (
                <Button 
                  onClick={() => onOpenChange(false)} 
                  className={`bg-gradient-to-r ${currentStepData.gradient} text-white border-0 hover:scale-105 transition-transform shadow-lg px-6`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Começar Agora!
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  className={`bg-gradient-to-r ${currentStepData.gradient} text-white border-0 hover:scale-105 transition-transform shadow-lg px-6`}
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </SimpleModal>
  );
}
