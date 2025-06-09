"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
  autoCloseDelay?: number
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  className,
  autoCloseDelay = 5000, // Default to 5 seconds
}: ModalProps) {
  React.useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseDelay, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg",
              className
            )}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {icon && (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  {icon}
                </div>
              )}
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  {title}
                </h2>
                <p className="text-sm text-gray-700">
                  {description}
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Got it
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ModalContextType {
  showModal: (props: Omit<ModalProps, "isOpen" | "onClose">) => void
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = React.useState<Omit<ModalProps, "isOpen" | "onClose"> | null>(null)

  const showModal = React.useCallback((props: Omit<ModalProps, "isOpen" | "onClose">) => {
    setModal(props)
  }, [])

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {modal && (
        <Modal
          {...modal}
          isOpen={true}
          onClose={() => setModal(null)}
        />
      )}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
} 