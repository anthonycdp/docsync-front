import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SimpleModal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription
} from "../ui/simple-modal";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { 
  FileText, 
  Code, 
  Database, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Book,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Rocket,
  Globe,
  Lock,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function ModernDocumentationModal({ open, onOpenChange }) {
  if (!open) return null;
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCopyCode = async (code, id) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { 
      id: "overview", 
      title: "Visão Geral", 
      icon: Sparkles, 
      color: "from-blue-500 to-purple-600",
      description: "Introdução à plataforma"
    },
    { 
      id: "api", 
      title: "API REST", 
      icon: Code, 
      color: "from-green-500 to-emerald-600",
      description: "Endpoints e integração"
    },
    { 
      id: "templates", 
      title: "Templates", 
      icon: FileText, 
      color: "from-orange-500 to-red-600",
      description: "Modelos de documentos"
    },
    { 
      id: "security", 
      title: "Segurança", 
      icon: Shield, 
      color: "from-cyan-500 to-blue-600",
      description: "Proteção de dados"
    },
    { 
      id: "integration", 
      title: "Integração", 
      icon: Layers, 
      color: "from-purple-500 to-pink-600",
      description: "Guias de implementação"
    }
  ];

  const content = {
    overview: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Hero Section */}
        <Card className="relative border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <CardHeader className="relative text-center pb-6">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-xl bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              DocSync Platform
            </CardTitle>
            <CardDescription className="text-gray-600 max-w-md mx-auto">
              Plataforma de automação documental inteligente com IA avançada
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, title: "IA Avançada", desc: "OCR inteligente", color: "from-yellow-400 to-orange-500" },
            { icon: Shield, title: "Seguro", desc: "Criptografia end-to-end", color: "from-green-400 to-emerald-500" },
            { icon: Globe, title: "Multi-formato", desc: "PDF, DOCX, imagens", color: "from-blue-400 to-cyan-500" },
            { icon: Rocket, title: "Rápido", desc: "Processamento em segundos", color: "from-purple-400 to-pink-500" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
            >
              <Card className="border-0 bg-gradient-to-br from-white to-gray-50/30 h-full">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <Card className="border-0 bg-gradient-to-r from-gray-50 to-blue-50/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              Stack Tecnológico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["React", "Python", "FastAPI", "TensorFlow", "PostgreSQL", "Docker", "Redis", "AWS"].map((tech) => (
                <Badge key={tech} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    
    api: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-green-800">
              <Code className="w-5 h-5" />
              API REST Endpoints
            </CardTitle>
            <CardDescription>
              Integração completa com sistemas externos via RESTful API
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-3">
          {[
            { method: "POST", endpoint: "/api/documents/process", desc: "Processa documentos e extrai dados", color: "bg-green-500" },
            { method: "GET", endpoint: "/api/documents/templates", desc: "Lista templates disponíveis", color: "bg-blue-500" },
            { method: "POST", endpoint: "/api/documents/generate/:id", desc: "Gera documento formatado", color: "bg-green-500" },
            { method: "GET", endpoint: "/api/status/:sessionId", desc: "Monitora status do processamento", color: "bg-yellow-500" }
          ].map((api, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${api.color} text-white border-0 text-xs`}>
                        {api.method}
                      </Badge>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {api.endpoint}
                      </code>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCode(api.endpoint, `api-${idx}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedCode === `api-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{api.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Example Code */}
        <Card className="border-0 bg-gray-900 text-green-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-400 flex items-center justify-between text-base">
              <span>Exemplo de Uso</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyCode(`curl -X POST "https://api.docsync.com/documents/process" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "template=responsabilidade_veiculo" \\
  -F "files=@document.pdf"`, "example-code")}
                className="text-green-400 hover:bg-green-400/10"
              >
                {copiedCode === "example-code" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-x-auto">
{`curl -X POST "https://api.docsync.com/documents/process" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "template=responsabilidade_veiculo" \\
  -F "files=@document.pdf"`}
            </pre>
          </CardContent>
        </Card>
      </motion.div>
    ),
    
    templates: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
              <FileText className="w-5 h-5" />
              Templates Jurídicos
            </CardTitle>
            <CardDescription>
              Templates pré-configurados para automação documental
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {[
            { 
              id: "responsabilidade_veiculo", 
              name: "Termo de Responsabilidade",
              desc: "Para veículos usados e transferências",
              docs: ["Proposta PDF"],
              color: "from-blue-500 to-blue-600",
              icon: "🚗"
            },
            { 
              id: "pagamento_terceiro", 
              name: "Pagamento a Terceiro",
              desc: "Declarações de pagamento",
              docs: ["Proposta PDF", "CNH", "Comprovante"],
              color: "from-green-500 to-green-600",
              icon: "💳"
            },
            { 
              id: "cessao_credito", 
              name: "Cessão de Crédito",
              desc: "Transferência de créditos",
              docs: ["Proposta PDF", "CNH", "Endereço"],
              color: "from-purple-500 to-purple-600",
              icon: "📋"
            }
          ].map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${template.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm">{template.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.docs.map((doc) => (
                      <Badge key={doc} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),
    
    security: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="border-0 bg-gradient-to-br from-cyan-50 to-blue-50/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-cyan-800">
              <Lock className="w-5 h-5" />
              Segurança e Privacidade
            </CardTitle>
            <CardDescription>
              Proteção máxima para seus dados sensíveis
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {[
            { 
              icon: Shield, 
              title: "Criptografia AES-256", 
              desc: "Todos os dados criptografados em trânsito e repouso",
              color: "from-green-500 to-emerald-500"
            },
            { 
              icon: Database, 
              title: "Isolamento de Sessão", 
              desc: "Cada processo isolado com limpeza automática",
              color: "from-blue-500 to-cyan-500"
            },
            { 
              icon: CheckCircle, 
              title: "Compliance LGPD", 
              desc: "Total conformidade com regulamentações",
              color: "from-purple-500 to-pink-500"
            }
          ].map((security, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
            >
              <Card className="">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${security.color} rounded-xl flex items-center justify-center`}>
                      <security.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{security.title}</h4>
                      <p className="text-sm text-gray-600">{security.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-800">Política de Retenção</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Dados automaticamente excluídos após 24 horas. Zero armazenamento permanente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    
    integration: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
              <Layers className="w-5 h-5" />
              Guia de Integração
            </CardTitle>
            <CardDescription>
              Integre o DocSync em seu sistema rapidamente
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-5">
          {[
            { 
              step: "1", 
              title: "Instalação", 
              content: `npm install @docsync/client`,
              type: "bash"
            },
            { 
              step: "2", 
              title: "Configuração", 
              content: `import DocSync from '@docsync/client'

const client = new DocSync({
  apiKey: import.meta.env.VITE_DOCSYNC_API_KEY,
  baseURL: 'https://api.docsync.com'
})`,
              type: "javascript"
            },
            { 
              step: "3", 
              title: "Uso Básico", 
              content: `const result = await client.process({
  template: 'responsabilidade_veiculo',
  files: [pdfFile]
})

console.log(result.extractedData)`,
              type: "javascript"
            }
          ].map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
            >
              <Card className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCode(step.content, `step-${step.step}`)}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedCode === `step-${step.step}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Card className="bg-gray-900 border-0">
                    <CardContent className="p-4">
                      <pre className="text-sm text-green-400 overflow-x-auto">
                        {step.content}
                      </pre>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-5 text-center">
            <h4 className="font-bold mb-2">Precisa de ajuda?</h4>
            <p className="text-blue-100 mb-4">Nossa equipe está pronta para auxiliar na integração</p>
            <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
              <ExternalLink className="w-4 h-4 mr-2" />
              Contatar Suporte
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  };

  return (
    <SimpleModal open={open} onOpenChange={onOpenChange} size="xl" className="h-[90vh]">
      <ModalContent>
          <ModalHeader 
            gradient="bg-gradient-to-r from-blue-600/90 via-purple-600/85 to-pink-600/90"
          >
            <ModalTitle>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Book className="w-6 h-6" />
              </div>
              Documentação DocSync
            </ModalTitle>
            <ModalDescription>
              Guia completo de recursos, APIs e integrações da plataforma
            </ModalDescription>
          </ModalHeader>

          <div className="flex flex-1 min-h-0">
            {/* Sidebar */}
            <motion.div 
              initial={false}
              animate={{ width: sidebarCollapsed ? 80 : 280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white/95 backdrop-blur-sm border-r border-gray-200 overflow-hidden shrink-0"
            >
              <div className={`p-4 ${sidebarCollapsed ? 'px-2' : ''}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`mb-4 w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'} transition-all duration-300`}
                  title={sidebarCollapsed ? "Expandir" : "Recolher"}
                >
                  {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 overflow-hidden whitespace-nowrap"
                      >
                        Recolher
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
                
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full group relative overflow-hidden rounded-xl ${sidebarCollapsed ? 'p-2 justify-center' : 'p-3'} text-left transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                            : "hover:bg-white/70 text-gray-700 hover:scale-102"
                        }`}
                        whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title={sidebarCollapsed ? section.title : ""}
                      >
                        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                          <AnimatePresence>
                            {!sidebarCollapsed && (
                              <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <span className="font-medium text-sm whitespace-nowrap">{section.title}</span>
                                {!isActive && (
                                  <p className="text-xs opacity-70 whitespace-nowrap">{section.description}</p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {isActive && !sidebarCollapsed && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <ScrollArea className="flex-1 p-6 bg-white/80">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {content[activeSection]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
      </ModalContent>
    </SimpleModal>
  );
}
