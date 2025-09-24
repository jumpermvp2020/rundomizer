"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ShareButtonProps {
    text: string
    url?: string
    title?: string
    className?: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
    children?: React.ReactNode
}

export function ShareButton({
    text,
    url = typeof window !== 'undefined' ? window.location.href : '',
    title = 'Поделиться результатом',
    className = "",
    variant = "outline",
    size = "default",
    children
}: ShareButtonProps) {
    const [isSharing, setIsSharing] = React.useState(false)
    const [fallbackUsed, setFallbackUsed] = React.useState(false)

    const handleShare = async () => {
        if (isSharing) return

        setIsSharing(true)

        try {
            // Проверяем поддержку Web Share API
            if (navigator.share && navigator.canShare) {
                const shareData = {
                    title: title,
                    text: text,
                    url: url
                }

                // Проверяем, можно ли поделиться данными
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData)
                    return
                }
            }

            // Fallback: копируем в буфер обмена
            setFallbackUsed(true)
            await navigator.clipboard.writeText(`${text}\n\n${url}`)
            
            // Показываем уведомление
            setTimeout(() => {
                setFallbackUsed(false)
            }, 2000)

        } catch (err) {
            console.error('Ошибка шаринга:', err)
            
            // Дополнительный fallback для старых браузеров
            try {
                const textArea = document.createElement('textarea')
                textArea.value = `${text}\n\n${url}`
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                
                setFallbackUsed(true)
                setTimeout(() => {
                    setFallbackUsed(false)
                }, 2000)
            } catch (fallbackErr) {
                console.error('Fallback копирование не удалось:', fallbackErr)
            }
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleShare}
            disabled={isSharing}
            className={`relative transition-all duration-200 ${className}`}
        >
            <AnimatePresence mode="wait">
                {fallbackUsed ? (
                    <motion.div
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        <span>Скопировано!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="share"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>{children || "Поделиться"}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    )
}
