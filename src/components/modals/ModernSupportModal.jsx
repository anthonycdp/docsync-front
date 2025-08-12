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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Mail, 
  Phone, 

  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  HeadphonesIcon,
  Loader2,
  HelpCircle,
  Sparkles,
  Zap,
  Shield,
  Star,
  User,
  AtSign,
  FileText,
  MessageCircle
} from "lucide-react";

export default function ModernSupportModal({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // CKDEV-NOTE: Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!formData.subject.trim()) {
      errors.subject = "Assunto é obrigatório";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Mensagem é obrigatória";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // CKDEV-NOTE: Simulated API call for form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setSubmitStatus(null);
      }, 3000);
    }, 2000);
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email",
      value: "anthonycoelho.dp@hotmail.com",
      desc: "Resposta em 24h",
      color: "from-blue-500 to-cyan-500",
      textColor: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Telefone",
      value: "+55 12 99601-0606",
      desc: "Segunda a sexta",
      color: "from-green-500 to-emerald-500",
      textColor: "text-green-600"
    }
  ];

  const faqs = [
    {
      question: "Quanto tempo leva o processamento?",
      answer: "Normalmente entre 2-3 minutos, dependendo do tamanho dos arquivos."
    },
    {
      question: "Quais formatos são aceitos?",
      answer: "Aceitamos PDF, DOCX, JPG e PNG para processamento."
    },
    {
      question: "Os dados são seguros?",
      answer: "Sim! Usamos criptografia end-to-end e deletamos dados após 24h."
    }
  ];

  return (
    <SimpleModal open={open} onOpenChange={onOpenChange} size="xl" className="h-[90vh]">
      <ModalContent>
          <ModalHeader 
            gradient="bg-gradient-to-r from-blue-500/90 via-purple-500/85 to-pink-500/90"
          >
            <ModalTitle>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <HelpCircle className="w-6 h-6" />
              </div>
              Central de Suporte
            </ModalTitle>
            <ModalDescription>
              Estamos aqui para ajudar! Nossa equipe está pronta para resolver suas dúvidas
            </ModalDescription>
          </ModalHeader>

          <ScrollArea className="flex-1 bg-white/80 overflow-y-auto">
            <div className="p-6">
              {/* Contact Options */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {contactOptions.map((option, idx) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                    >
                      <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden h-full">
                        <div className={`h-2 bg-gradient-to-r ${option.color}`} />
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 mb-1">{option.title}</h4>
                          <p className="text-xs text-gray-700 font-medium mb-1">{option.value}</p>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Main Content - 2 Column Layout */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg overflow-hidden h-fit">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Send className="w-4 h-4 text-white" />
                        </div>
                        Envie sua Mensagem
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-sm flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Nome Completo
                            </Label>
                            <div className="mt-1 relative">
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Seu nome"
                                className={`transition-all duration-200 ${
                                  fieldErrors.name 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : 'focus:border-green-500 focus:ring-green-500/20'
                                }`}
                              />
                              <AnimatePresence>
                                {fieldErrors.name && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    {fieldErrors.name}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm flex items-center gap-2">
                              <AtSign className="w-4 h-4" />
                              Email
                            </Label>
                            <div className="mt-1 relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="seu@email.com"
                                className={`transition-all duration-200 ${
                                  fieldErrors.email 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : 'focus:border-green-500 focus:ring-green-500/20'
                                }`}
                              />
                              <AnimatePresence>
                                {fieldErrors.email && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    {fieldErrors.email}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="subject" className="text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Assunto
                          </Label>
                          <div className="mt-1 relative">
                            <Input
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="Como podemos ajudar?"
                              className={`transition-all duration-200 ${
                                fieldErrors.subject 
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                  : 'focus:border-green-500 focus:ring-green-500/20'
                              }`}
                            />
                            <AnimatePresence>
                              {fieldErrors.subject && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  {fieldErrors.subject}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Mensagem
                          </Label>
                          <div className="mt-1 relative">
                            <Textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="Descreva sua dúvida ou problema..."
                              className={`min-h-[120px] transition-all duration-200 ${
                                fieldErrors.message 
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                  : 'focus:border-green-500 focus:ring-green-500/20'
                              }`}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {formData.message.length}/500
                            </div>
                            <AnimatePresence>
                              {fieldErrors.message && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  {fieldErrors.message}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <AnimatePresence>
                          {submitStatus === "success" && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                            >
                              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50/50">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-green-800">
                                        Mensagem enviada com sucesso!
                                      </p>
                                      <p className="text-xs text-green-600">
                                        Responderemos em breve no seu email
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:scale-105 transition-all duration-300"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar Mensagem
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Right Column - FAQs and Features */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* FAQs */}
                  <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500" />
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        Perguntas Frequentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                          >
                            <Card className="border-0 bg-gradient-to-r from-gray-50 to-blue-50/30">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white font-bold text-xs">?</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">
                                      {faq.question}
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Time & Features */}
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Clock, title: "Resposta em 24h", desc: "Tempo médio de resposta", color: "from-blue-500 to-cyan-500" },
                      { icon: Zap, title: "Suporte Eficiente", desc: "Resolução rápida", color: "from-yellow-500 to-orange-500" },
                      { icon: Shield, title: "Dados Protegidos", desc: "Privacidade garantida", color: "from-green-500 to-emerald-500" }
                    ].map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                      >
                        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{feature.title}</h4>
                              <p className="text-xs text-gray-600">{feature.desc}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </ScrollArea>
      </ModalContent>
    </SimpleModal>
  );
}
