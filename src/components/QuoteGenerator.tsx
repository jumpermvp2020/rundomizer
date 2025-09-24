'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw, Share2 } from 'lucide-react'
import { quotes, Quote } from '@/data/quotes'

interface GeneratedQuote {
    quote: Quote
    timestamp: number
}

export default function QuoteGenerator() {
    const [currentQuote, setCurrentQuote] = useState<GeneratedQuote | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const generateQuote = () => {
        setIsGenerating(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            // Используем crypto.getRandomValues для честной генерации
            const array = new Uint32Array(1)
            crypto.getRandomValues(array)
            const randomIndex = array[0] % quotes.length

            setCurrentQuote({
                quote: quotes[randomIndex],
                timestamp: Date.now()
            })
            setIsGenerating(false)
        }, 800)
    }

    const shareResult = () => {
        if (currentQuote === null) return

        const text = `"${currentQuote.quote.text}" — ${currentQuote.quote.author}`
        navigator.clipboard.writeText(text)
        alert('Цитата скопирована в буфер обмена!')
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-8">
                {/* Основной дисплей цитаты */}
                <div className="text-center">
                    <AnimatePresence mode="wait">
                        {currentQuote ? (
                            <motion.div
                                key={currentQuote.quote.text}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className="bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-2xl p-8 mx-auto max-w-2xl">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-xl md:text-2xl font-medium text-[#1A1A1A] leading-relaxed mb-6"
                                    >
                                        "{currentQuote.quote.text}"
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-lg font-semibold text-[#4B5563] text-right"
                                    >
                                        — {currentQuote.quote.author}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-6xl md:text-7xl font-bold text-[#9CA3AF] mb-4"
                            >
                                💭
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Кнопка генерации */}
                <div className="text-center">
                    <motion.div
                        animate={isGenerating ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isGenerating ? Infinity : 0 }}
                    >
                        <Button
                            onClick={generateQuote}
                            disabled={isGenerating}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-12 py-4 text-xl font-medium rounded-xl"
                        >
                            {isGenerating ? 'Генерируем...' : 'Получить цитату'}
                        </Button>
                    </motion.div>
                </div>

                {/* Дополнительные действия */}
                {currentQuote && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={generateQuote}
                            className="text-[#4B5563] border-[#D1D5DB] hover:bg-[#F9F5FF]"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Ещё цитату
                        </Button>
                        <Button
                            variant="outline"
                            onClick={shareResult}
                            className="text-[#4B5563] border-[#D1D5DB] hover:bg-[#F9F5FF]"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Поделиться
                        </Button>
                    </motion.div>
                )}

                {/* Информация */}
                <div className="text-center text-sm text-[#9CA3AF]">
                    <p>Коллекция вдохновляющих цитат</p>
                    <p>Используется криптографически стойкий генератор</p>
                </div>
            </div>
        </Card>
    )
}
