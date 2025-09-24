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

    const getCopyText = () => {
        if (words.length === 0) return ""
        return `Случайные слова: ${words.map(w => w.word).join(', ')}`
    }

    const getShareText = () => {
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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                                <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
                                    Результат ({words.length} слов)
                                </h3>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={generateWords}
                                        className="text-[#4B5563] border-[#D1D5DB] text-xs px-2 py-1 h-7"
                                    >
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">Ещё раз</span>
                                        <span className="sm:hidden">Ещё</span>
                                    </Button>
                                    <CopyButton
                                        text={getCopyText()}
                                        size="sm"
                                        className="text-[#4B5563] border-[#D1D5DB] text-xs px-2 py-1 h-7"
                                    >
                                        <span className="hidden sm:inline">Копировать</span>
                                        <span className="sm:hidden">Копия</span>
                                    </CopyButton>
                                    <ShareButton
                                        text={getShareText()}
                                        title="Случайные слова"
                                        size="sm"
                                        className="text-[#4B5563] border-[#D1D5DB] text-xs px-2 py-1 h-7"
                                    >
                                        <span className="hidden sm:inline">Поделиться</span>
                                        <span className="sm:hidden">Шарить</span>
                                    </ShareButton>
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
