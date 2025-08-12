import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { HelpCircle, CheckCircle2 } from "lucide-react";

// CKDEV-NOTE: Interface para tipagem dos dados do guia rápido
const QuickGuideStep = {
  number: 1,
  title: "Escolha o Template",
  description: "Selecione o tipo de documento jurídico",
  color: "blue"
};

const QuickTip = {
  text: "Aceita PDF, DOCX e imagens"
};

const QuickGuide = ({ 
  steps = [], 
  tips = [], 
  title = "Guia Rápido",
  className = "" 
}) => {
  // CKDEV-NOTE: Cores dos passos mapeadas para classes Tailwind
  const stepColors = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white", 
    orange: "bg-orange-500 text-white",
    purple: "bg-purple-500 text-white"
  };

  // CKDEV-NOTE: Dados padrão caso não sejam fornecidos
  const defaultSteps = [
    {
      number: 1,
      title: "Escolha o Template",
      description: "Selecione o tipo de documento jurídico",
      color: "blue"
    },
    {
      number: 2,
      title: "Envie os Arquivos",
      description: "Faça upload dos documentos necessários",
      color: "green"
    },
    {
      number: 3,
      title: "Revise os Dados",
      description: "Valide as informações extraídas",
      color: "orange"
    },
    {
      number: 4,
      title: "Baixe o Documento",
      description: "Documento preenchido automaticamente",
      color: "purple"
    }
  ];

  const defaultTips = [
    { text: "Aceita PDF, DOCX e imagens" },
    { text: "Processamento automático de dados" },
    { text: "Suporte a múltiplos documentos" }
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;
  const displayTips = tips.length > 0 ? tips : defaultTips;

  return (
    <Card className={`w-full max-w-md mx-auto shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-gray-800 font-semibold text-lg">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Seção dos Passos */}
        <div className="space-y-4 mb-6">
          {displaySteps.map((step, index) => (
            <div 
              key={step.number}
              className="flex items-start gap-4 group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
            >
              <Badge 
                className={`${stepColors[step.color]} w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm`}
                variant="default"
              >
                {step.number}
              </Badge>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Separador */}
        <Separator className="my-6" />

        {/* Seção de Dicas */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <h4 className="font-semibold text-gray-900 text-sm">
              Dicas Rápidas
            </h4>
          </div>
          
          <ul className="space-y-2">
            {displayTips.map((tip, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">
                  {tip.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickGuide;
