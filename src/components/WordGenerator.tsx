'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/components/ui/copy-button'
import { RefreshCw, Share2 } from 'lucide-react'
import { russianWords } from '@/data/words'

interface GeneratedWord {
    word: string
    timestamp: number
}

export default function WordGenerator() {
    const [count, setCount] = useState(1)
    const [words, setWords] = useState<GeneratedWord[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const generateWords = () => {
        if (count > 10) {
            alert('Максимум 10 слов за раз')
            return
        }

        setIsGenerating(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            const newWords: GeneratedWord[] = []

            for (let i = 0; i < count; i++) {
                // Используем crypto.getRandomValues для честной генерации
                const array = new Uint32Array(1)
                crypto.getRandomValues(array)
                const randomIndex = array[0] % russianWords.length
                newWords.push({
                    word: russianWords[randomIndex],
                    timestamp: Date.now()
                })
            }

            setWords(newWords)
            setIsGenerating(false)
        }, 600)
    }

    const shareResults = () => {
        if (words.length === 0) return

        const text = `Случайные слова: ${words.map(w => w.word).join(', ')}`
        navigator.clipboard.writeText(text)
        alert('Результаты скопированы в буфер обмена!')
    }

    const getCopyText = () => {
        if (words.length === 0) return ""
        return `Случайные слова: ${words.map(w => w.word).join(', ')}`
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-6">
                {/* Настройки */}
                <div className="max-w-xs mx-auto">
                    <Label htmlFor="count" className="text-sm font-medium text-[#4B5563]">
                        Количество слов
                    </Label>
                    <Input
                        id="count"
                        type="number"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="mt-1"
                        placeholder="1"
                        min="1"
                        max="10"
                    />
                </div>

                {/* Кнопка генерации */}
                <div className="text-center">
                    <motion.div
                        animate={isGenerating ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isGenerating ? Infinity : 0 }}
                    >
                        <Button
                            onClick={generateWords}
                            disabled={isGenerating}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-8 py-3 text-lg font-medium rounded-xl"
                        >
                            {isGenerating ? 'Генерируем...' : 'Получить слова'}
                        </Button>
                    </motion.div>
                </div>

                {/* Результаты */}
                <AnimatePresence>
                    {words.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                    Результат ({words.length} слов)
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={generateWords}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {words.map((word, index) => (
                                    <motion.div
                                        key={`${word.word}-${word.timestamp}-${index}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-xl p-6 text-center"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                            className="text-2xl font-bold text-[#1A1A1A] capitalize"
                                        >
                                            {word.word}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-xs text-[#9CA3AF] text-right">
                                Сгенерировано: {new Date(words[0]?.timestamp).toLocaleString('ru-RU')}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    )
}
