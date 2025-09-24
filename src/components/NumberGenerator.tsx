'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/components/ui/copy-button'
import { ShareButton } from '@/components/ui/share-button'
import { RefreshCw } from 'lucide-react'

interface GeneratedNumber {
    value: number
    timestamp: number
}

export default function NumberGenerator() {
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(100)
    const [count, setCount] = useState(1)
    const [numbers, setNumbers] = useState<GeneratedNumber[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const generateNumbers = () => {
        if (from >= to) {
            alert('Число "от" должно быть меньше числа "до"')
            return
        }

        if (count > 1000) {
            alert('Максимум 1000 чисел за раз')
            return
        }

        setIsGenerating(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            const newNumbers: GeneratedNumber[] = []
            const range = to - from + 1

            for (let i = 0; i < count; i++) {
                // Используем crypto.getRandomValues для честной генерации
                const array = new Uint32Array(1)
                crypto.getRandomValues(array)
                const randomValue = from + (array[0] % range)
                newNumbers.push({
                    value: randomValue,
                    timestamp: Date.now()
                })
            }

            setNumbers(newNumbers)
            setIsGenerating(false)
        }, 500)
    }

    const getCopyText = () => {
        if (numbers.length === 0) return ""
        return `Сгенерированные числа: ${numbers.map(n => n.value).join(', ')}`
    }

    const getShareText = () => {
        if (numbers.length === 0) return ""
        return `Сгенерированные числа: ${numbers.map(n => n.value).join(', ')}`
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-6">
                {/* Настройки */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="from" className="text-sm font-medium text-[#4B5563]">
                            От
                        </Label>
                        <Input
                            id="from"
                            type="number"
                            value={from}
                            onChange={(e) => setFrom(parseInt(e.target.value) || 1)}
                            className="mt-1"
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="to" className="text-sm font-medium text-[#4B5563]">
                            До
                        </Label>
                        <Input
                            id="to"
                            type="number"
                            value={to}
                            onChange={(e) => setTo(parseInt(e.target.value) || 100)}
                            className="mt-1"
                            placeholder="100"
                        />
                    </div>
                    <div>
                        <Label htmlFor="count" className="text-sm font-medium text-[#4B5563]">
                            Количество
                        </Label>
                        <Input
                            id="count"
                            type="number"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                            className="mt-1"
                            placeholder="1"
                            min="1"
                            max="1000"
                        />
                    </div>
                </div>

                {/* Кнопка генерации */}
                <div className="text-center">
                    <motion.div
                        animate={isGenerating ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isGenerating ? Infinity : 0 }}
                    >
                        <Button
                            onClick={generateNumbers}
                            disabled={isGenerating}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-8 py-3 text-lg font-medium rounded-xl"
                        >
                            {isGenerating ? 'Генерируем...' : 'Сгенерировать числа'}
                        </Button>
                    </motion.div>
                </div>

                {/* Результаты */}
                <AnimatePresence>
                    {numbers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                    Результат ({numbers.length} чисел)
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={generateNumbers}
                                        className="text-[#4B5563] border-[#D1D5DB]"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Ещё раз
                                    </Button>
                                    <CopyButton
                                        text={getCopyText()}
                                        size="sm"
                                        className="text-[#4B5563] border-[#D1D5DB]"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={shareResults}
                                        className="text-[#4B5563] border-[#D1D5DB]"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Поделиться
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {numbers.map((number, index) => (
                                    <motion.div
                                        key={`${number.value}-${number.timestamp}-${index}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-xl p-4 text-center"
                                    >
                                        <div className="text-2xl font-bold text-[#1A1A1A]">
                                            {number.value}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-xs text-[#9CA3AF] text-right">
                                Сгенерировано: {new Date(numbers[0]?.timestamp).toLocaleString('ru-RU')}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    )
}
