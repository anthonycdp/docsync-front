import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import LumaSpin from './ui/luma-spin'
import BackToHomeButton from './BackToHomeButton'

const GeneratingLoader = ({ onBackToHome, templateName = "documento" }) => {
  const [dots, setDots] = useState('')
  const animationRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // CKDEV-NOTE: Centralizar animação ao montar componente
  useEffect(() => {
    if (animationRef.current) {
      const element = animationRef.current
      const rect = element.getBoundingClientRect()
      const elementTopFromViewport = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight
      const currentScrollY = window.scrollY
      
      const elementCenterY = elementTopFromViewport + currentScrollY + (elementHeight / 2)
      const viewportCenterY = windowHeight / 2
      const scrollPosition = elementCenterY - viewportCenterY
      
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }
  }, [])

  // CKDEV-NOTE: Partículas flutuantes para efeito visual
  const particles = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
      initial={{ 
        x: Math.random() * window.innerWidth || 0, 
        y: Math.random() * window.innerHeight || 0,
        opacity: 0 
      }}
      animate={{ 
        x: Math.random() * (window.innerWidth || 1200), 
        y: Math.random() * (window.innerHeight || 800),
        opacity: [0, 0.6, 0] 
      }}
      transition={{ 
        duration: 4 + Math.random() * 3, 
        repeat: Infinity, 
        ease: "linear",
        delay: Math.random() * 2 
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {particles}
      </div>

      {/* Gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-100/30" />
      
      {/* Padrão geométrico de fundo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Header com botão voltar */}
      <div className="relative z-10 p-6">
        <div className="flex justify-end">
          {onBackToHome && <BackToHomeButton onBackToHome={onBackToHome} />}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 -mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Card principal com glassmorphism */}
          <motion.div
            ref={animationRef}
            className="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-12 shadow-2xl shadow-blue-200/20"
            initial={{ boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.1)" }}
            animate={{ 
              boxShadow: [
                "0 25px 50px -12px rgba(59, 130, 246, 0.1)",
                "0 35px 70px -12px rgba(59, 130, 246, 0.2)",
                "0 25px 50px -12px rgba(59, 130, 246, 0.1)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Brilho superior */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60" />
            
            {/* Loader animado */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <LumaSpin />
            </motion.div>

            {/* Título principal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800 bg-clip-text text-transparent mb-2">
                Gerando Documento{dots}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Processando seu {templateName}
              </p>
            </motion.div>

            {/* Barra de progresso estilizada */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="w-full max-w-sm mx-auto"
            >
              <div className="h-2 bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 8, 
                    ease: "easeInOut",
                    repeat: Infinity 
                  }}
                />
              </div>
            </motion.div>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-sm text-slate-500 mt-6 max-w-md mx-auto leading-relaxed"
            >
              Estamos processando suas informações e gerando o documento final. 
              Isso pode levar alguns momentos.
            </motion.p>
          </motion.div>

          {/* Indicadores de status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="mt-8 flex justify-center space-x-4"
          >
            {['Validando', 'Processando', 'Finalizando'].map((step, index) => (
              <motion.div
                key={step}
                className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/30"
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.7,
                  ease: "easeInOut"
                }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-xs font-medium text-slate-600">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Efeito de ondas no rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-100/40 to-transparent"
          animate={{ 
            transform: [
              "translateX(-100px) scaleY(1)",
              "translateX(100px) scaleY(1.2)",
              "translateX(-100px) scaleY(1)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

export default GeneratingLoader