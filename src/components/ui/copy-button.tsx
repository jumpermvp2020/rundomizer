"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CopyButtonProps {
    text: string
    className?: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
    children?: React.ReactNode
}

export function CopyButton({
    text,
    className = "",
    variant = "outline",
    size = "default",
    children
}: CopyButtonProps) {
    const [copied, setCopied] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleCopy = async () => {
        if (isLoading) return

        setIsLoading(true)

        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)

            // Сброс состояния через 2 секунды
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (err) {
            console.error('Ошибка копирования:', err)
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)

            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            disabled={isLoading}
            className={`relative transition-all duration-200 ${className}`}
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        <span>Скопировано!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        <span>{children || "Копировать"}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    )
}
