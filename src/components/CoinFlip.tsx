'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw, Share2 } from 'lucide-react'

type CoinResult = 'heads' | 'tails' | null

interface CoinFlipResult {
    result: CoinResult
    timestamp: number
}

export default function CoinFlip() {
    const [flipResult, setFlipResult] = useState<CoinFlipResult | null>(null)
    const [isFlipping, setIsFlipping] = useState(false)

    const flipCoin = () => {
        setIsFlipping(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            // Используем crypto.getRandomValues для честной генерации
            const array = new Uint32Array(1)
            crypto.getRandomValues(array)
            const result: CoinResult = array[0] % 2 === 0 ? 'heads' : 'tails'

            setFlipResult({
                result,
                timestamp: Date.now()
            })
            setIsFlipping(false)
        }, 2000) // Длительная анимация для эффекта вращения
    }

    const shareResult = () => {
        if (flipResult === null) return

        const resultText = flipResult.result === 'heads' ? 'Орёл' : 'Решка'
        const text = `Результат броска монеты: ${resultText}`
        navigator.clipboard.writeText(text)
        alert('Результат скопирован в буфер обмена!')
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-8">
                {/* Монета */}
                <div className="text-center">
                    <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {flipResult ? (
                                <motion.div
                                    key={flipResult.result}
                                    initial={{ opacity: 0, rotateY: 180 }}
                                    animate={{ opacity: 1, rotateY: 0 }}
                                    exit={{ opacity: 0, rotateY: -180 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
                                    }}
                                >
                                    {flipResult.result === 'heads' ? '🦅' : '🪙'}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
                                    }}
                                >
                                    🪙
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Анимация вращения */}
                        {isFlipping && (
                            <motion.div
                                animate={{ rotateY: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
                                }}
                            />
                        )}
                    </div>

                    {/* Результат */}
                    {flipResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6"
                        >
                            <div className="text-3xl font-bold text-[#1A1A1A] mb-2">
                                {flipResult.result === 'heads' ? 'Орёл' : 'Решка'}
                            </div>
                            <div className="text-sm text-[#9CA3AF]">
                                Результат броска
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Кнопка броска */}
                <div className="text-center">
                    <motion.div
                        animate={isFlipping ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isFlipping ? Infinity : 0 }}
                    >
                        <Button
                            onClick={flipCoin}
                            disabled={isFlipping}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-12 py-4 text-xl font-medium rounded-xl"
                        >
                            {isFlipping ? 'Бросаем...' : 'Бросить монету'}
                        </Button>
                    </motion.div>
                </div>

                {/* Дополнительные действия */}
                {flipResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={flipCoin}
                            className="text-[#4B5563] border-[#D1D5DB] hover:bg-[#F9F5FF]"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Ещё раз
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
                    <p>Честный результат броска монеты</p>
                    <p>Используется криптографически стойкий генератор</p>
                </div>
            </div>
        </Card>
    )
}
