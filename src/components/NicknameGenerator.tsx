'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Share2 } from 'lucide-react'
import { adjectives, nouns, numbers } from '@/data/nicknames'

interface GeneratedNickname {
    nickname: string
    timestamp: number
}

export default function NicknameGenerator() {
    const [count, setCount] = useState(1)
    const [nicknames, setNicknames] = useState<GeneratedNickname[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const generateNickname = () => {
        if (count > 5) {
            alert('Максимум 5 никнеймов за раз')
            return
        }

        setIsGenerating(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            const newNicknames: GeneratedNickname[] = []

            for (let i = 0; i < count; i++) {
                // Используем crypto.getRandomValues для честной генерации
                const array = new Uint32Array(3)
                crypto.getRandomValues(array)

                const adjective = adjectives[array[0] % adjectives.length]
                const noun = nouns[array[1] % nouns.length]
                const number = numbers[array[2] % numbers.length]

                // Создаём никнейм в разных форматах
                const formats = [
                    `${adjective}${noun}${number}`,
                    `${adjective}_${noun}_${number}`,
                    `${adjective}${noun}`,
                    `${noun}${number}`,
                    `${adjective}${number}`
                ]

                const formatArray = new Uint32Array(1)
                crypto.getRandomValues(formatArray)
                const selectedFormat = formats[formatArray[0] % formats.length]

                newNicknames.push({
                    nickname: selectedFormat,
                    timestamp: Date.now()
                })
            }

            setNicknames(newNicknames)
            setIsGenerating(false)
        }, 600)
    }

    const shareResults = () => {
        if (nicknames.length === 0) return

        const text = `Случайные никнеймы: ${nicknames.map(n => n.nickname).join(', ')}`
        navigator.clipboard.writeText(text)
        alert('Результаты скопированы в буфер обмена!')
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-6">
                {/* Настройки */}
                <div className="max-w-xs mx-auto">
                    <Label htmlFor="count" className="text-sm font-medium text-[#4B5563]">
                        Количество никнеймов
                    </Label>
                    <Input
                        id="count"
                        type="number"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="mt-1"
                        placeholder="1"
                        min="1"
                        max="5"
                    />
                </div>

                {/* Кнопка генерации */}
                <div className="text-center">
                    <motion.div
                        animate={isGenerating ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isGenerating ? Infinity : 0 }}
                    >
                        <Button
                            onClick={generateNickname}
                            disabled={isGenerating}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-8 py-3 text-lg font-medium rounded-xl"
                        >
                            {isGenerating ? 'Генерируем...' : 'Получить никнеймы'}
                        </Button>
                    </motion.div>
                </div>

                {/* Результаты */}
                <AnimatePresence>
                    {nicknames.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                    Результат ({nicknames.length} никнеймов)
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={generateNickname}
                                        className="text-[#4B5563] border-[#D1D5DB]"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Ещё раз
                                    </Button>
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

                            <div className="space-y-3">
                                {nicknames.map((nickname, index) => (
                                    <motion.div
                                        key={`${nickname.nickname}-${nickname.timestamp}-${index}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-xl p-4 text-center"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                            className="text-xl font-bold text-[#1A1A1A] font-mono"
                                        >
                                            {nickname.nickname}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-xs text-[#9CA3AF] text-right">
                                Сгенерировано: {new Date(nicknames[0]?.timestamp).toLocaleString('ru-RU')}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    )
}
