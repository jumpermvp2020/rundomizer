'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CopyButton } from '@/components/ui/copy-button'
import { RefreshCw, Share2 } from 'lucide-react'

export default function SingleNumberGenerator() {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationCount, setGenerationCount] = useState(0)

    const generateNumber = () => {
        setIsGenerating(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            // Используем crypto.getRandomValues для честной генерации
            const array = new Uint32Array(1)
            crypto.getRandomValues(array)
            const randomNumber = 1 + (array[0] % 100)

            setCurrentNumber(randomNumber)
            setGenerationCount(prev => prev + 1)
            setIsGenerating(false)
        }, 800)
    }

    const shareResult = () => {
        if (currentNumber === null) return

        const text = `Случайное число: ${currentNumber}`
        navigator.clipboard.writeText(text)
        alert('Результат скопирован в буфер обмена!')
    }

    const getCopyText = () => {
        if (currentNumber === null) return ""
        return `Случайное число: ${currentNumber}`
    }

    return (
        <Card className="p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-10">
                {/* Основной дисплей числа */}
                <div className="text-center">
                    <AnimatePresence mode="wait">
                        {currentNumber !== null ? (
                            <motion.div
                                key={currentNumber}
                                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative"
                            >
                                <div className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                    {currentNumber}
                                </div>
                                <div className="text-sm text-[#9CA3AF]">
                                    Генерация #{generationCount}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-6xl md:text-7xl font-bold text-[#9CA3AF] mb-4"
                            >
                                ?
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
                            onClick={generateNumber}
                            disabled={isGenerating}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {isGenerating ? 'Генерируем...' : 'Получить число'}
                        </Button>
                    </motion.div>
                </div>

                {/* Дополнительные действия */}
                {currentNumber !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={generateNumber}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-6 py-3 transition-all duration-200"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Ещё раз
                        </Button>
                        <CopyButton
                            text={getCopyText()}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-6 py-3"
                        />
                        <Button
                            variant="outline"
                            onClick={shareResult}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-6 py-3 transition-all duration-200"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Поделиться
                        </Button>
                    </motion.div>
                )}

                {/* Информация */}
                <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Диапазон: 1 - 100</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Криптографически стойкий</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
