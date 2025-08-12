import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { 
  FileText, 
  Shield, 
  Lock, 
  Zap, 
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  BookOpen
} from "lucide-react"
import ModernDocumentationModal from "./modals/ModernDocumentationModal"
import ModernHowToUseModal from "./modals/ModernHowToUseModal"
import ModernSupportModal from "./modals/ModernSupportModal"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [systemStatus, setSystemStatus] = useState("online")
  const [openModal, setOpenModal] = useState(null)
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const features = [
    { icon: Zap, text: "Processamento instantâneo", color: "text-yellow-500" },
    { icon: Shield, text: "Dados seguros", color: "text-green-500" },
    { icon: Lock, text: "Criptografia ponta a ponta", color: "text-blue-500" },
    { icon: FileText, text: "Múltiplos formatos", color: "text-purple-500" }
  ]

  const quickLinks = [
    { name: "Documentação", action: () => setOpenModal("documentation"), icon: FileText },
    { name: "Como Usar", action: () => setOpenModal("howToUse"), icon: HelpCircle },
    { name: "Suporte", action: () => setOpenModal("support"), icon: Mail }
  ]

  const socialLinks = [
    { icon: Mail, href: "mailto:anthonycoelho.dp@hotmail.com", label: "Email" }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 via-blue-50/20 to-white border-t border-gray-200/60 mt-16">
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {feature.text}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  DocSync
                </h3>
                <p className="text-xs text-gray-600">Automação Inteligente de Documentos</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Automatize a criação de documentos jurídicos com extração de dados por IA. 
              Transforme seus PDFs em documentos perfeitamente formatados em segundos.
            </p>


          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Links Rápidos</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <button
                    key={link.name}
                    onClick={link.action}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <Icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>São José dos Campos, São Paulo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>+55 12 99601-0606</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>anthonycoelho.dp@hotmail.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white text-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>&copy; {currentYear} DocSync. Todos os direitos reservados.</span>
          </div>
          
          {/* Version Badge */}
          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
            Versão 1.0.0
          </Badge>
        </div>
      </div>

      {/* Modals */}
      <ModernDocumentationModal 
        open={openModal === "documentation"} 
        onOpenChange={(open) => !open && setOpenModal(null)} 
      />
      <ModernHowToUseModal 
        open={openModal === "howToUse"} 
        onOpenChange={(open) => !open && setOpenModal(null)} 
      />
      <ModernSupportModal 
        open={openModal === "support"} 
        onOpenChange={(open) => !open && setOpenModal(null)} 
      />
    </footer>
  )
}