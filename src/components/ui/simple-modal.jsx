import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

// CKDEV-NOTE: Simplified modal component without context complexity
export function SimpleModal({ 
  open, 
  onOpenChange, 
  children, 
  className, 
  size = "default" 
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onOpenChange(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onOpenChange]);

  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-2xl", 
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]"
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backdropFilter: "blur(8px)"
          }}
          exit={{ 
            opacity: 0,
            backdropFilter: "blur(0px)"
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className={cn(
              "relative z-50 w-full max-h-[90vh] bg-white dark:bg-neutral-950",
              "border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl",
              "flex flex-col overflow-hidden",
              sizeClasses[size],
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              type: "spring",
              duration: 0.4,
              bounce: 0.1
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                "absolute top-4 right-4 z-10 p-2 rounded-full",
                "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
                "text-gray-600 hover:text-gray-800",
                "transition-all duration-200 hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-gray-500"
              )}
              aria-label="Fechar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ModalContent = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col flex-1 min-h-0", className)}>
      {children}
    </div>
  );
};

export const ModalHeader = ({ children, className, gradient }) => {
  return (
    <div className={cn("relative shrink-0", className)}>
      {gradient && (
        <div className={cn("absolute inset-0 rounded-t-2xl", gradient)} />
      )}
      <div className="relative p-6 text-white">
        {children}
      </div>
    </div>
  );
};

export const ModalTitle = ({ children, className }) => {
  return (
    <h2 className={cn("text-2xl font-bold flex items-center gap-3", className)}>
      {children}
    </h2>
  );
};

export const ModalDescription = ({ children, className }) => {
  return (
    <p className={cn("text-white/90 text-base mt-2", className)}>
      {children}
    </p>
  );
};

export const ModalFooter = ({ children, className }) => {
  return (
    <div className={cn(
      "flex items-center justify-end gap-2 p-6 border-t border-gray-200/60 shrink-0",
      className
    )}>
      {children}
    </div>
  );
};
