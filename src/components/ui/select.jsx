import { useState, createContext, useContext } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

const SelectContext = createContext()

const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <SelectContext.Provider value={{
      value,
      onValueChange,
      isOpen,
      setIsOpen
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = ({ className, children, ...props }) => {
  const { isOpen, setIsOpen } = useContext(SelectContext)
  
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext)
  
  return (
    <span className={cn(
      value ? "text-gray-900" : "text-gray-500"
    )}>
      {value || placeholder}
    </span>
  )
}

const SelectContent = ({ children, className }) => {
  const { isOpen } = useContext(SelectContext)
  
  if (!isOpen) return null
  
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md animate-in fade-in-0 zoom-in-95",
      "top-full mt-1 w-full",
      className
    )}>
      <div className="p-1">
        {children}
      </div>
    </div>
  )
}

const SelectItem = ({ value, children, className }) => {
  const { onValueChange, setIsOpen } = useContext(SelectContext)
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      onClick={() => {
        onValueChange(value)
        setIsOpen(false)
      }}
    >
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }