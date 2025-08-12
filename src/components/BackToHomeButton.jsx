import React from 'react'
import { Button } from './ui/button'
import { Home } from 'lucide-react'

const BackToHomeButton = ({ onBackToHome, className, ...props }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onBackToHome}
      className={`flex items-center gap-2 px-4 py-2 h-9 rounded-lg border border-gray-200 hover:border-gray-300 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 shadow-sm hover:shadow-md transition-all duration-200 group ${className || ''}`}
      aria-label="Voltar ao Início"
      {...props}
    >
      <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
      <span className="font-medium text-sm">Voltar ao Início</span>
    </Button>
  )
}

export default BackToHomeButton
