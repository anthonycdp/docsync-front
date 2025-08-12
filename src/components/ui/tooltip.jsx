import React, { useState, useContext, createContext } from "react"
import { cn } from "../../lib/utils"

const TooltipContext = createContext()

const TooltipProvider = ({ children }) => children

const Tooltip = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <TooltipContext.Provider value={{ isVisible, setIsVisible }}>
      <div className="relative inline-block">
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = ({ children, asChild = false, ...props }) => {
  const { setIsVisible } = useContext(TooltipContext)
  
  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
    </div>
  )
}

const TooltipContent = ({ children, className, ...props }) => {
  const { isVisible } = useContext(TooltipContext)
  
  if (!isVisible) return null
  
  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95",
        "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }