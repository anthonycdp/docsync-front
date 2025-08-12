import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])
  
  const toast = ({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }
  
  return { toast, toasts }
}