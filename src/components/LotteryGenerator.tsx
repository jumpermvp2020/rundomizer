'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RefreshCw, Share2, Plus, X, Users } from 'lucide-react'

interface LotteryResult {
    winner: string
    timestamp: number
}

export default function LotteryGenerator() {
    const [participantList, setParticipantList] = useState<string[]>([])
    const [newParticipant, setNewParticipant] = useState('')
    const [result, setResult] = useState<LotteryResult | null>(null)
    const [isSpinning, setIsSpinning] = useState(false)

    const addParticipant = () => {
        const trimmedName = newParticipant.trim()

        if (!trimmedName) {
            alert('Введите имя участника')
            return
        }

        if (participantList.includes(trimmedName)) {
            alert('Этот участник уже добавлен')
            return
        }

        if (participantList.length >= 1000) {
            alert('Максимум 1,000 участников')
            return
        }

        setParticipantList([...participantList, trimmedName])
        setNewParticipant('')
    }

    const removeParticipant = (index: number) => {
        setParticipantList(participantList.filter((_, i) => i !== index))
    }

    const clearAllParticipants = () => {
        setParticipantList([])
        setResult(null)
    }

    const conductLottery = () => {
        if (participantList.length === 0) {
            alert('Добавьте хотя бы одного участника')
            return
        }

        setIsSpinning(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            // Используем crypto.getRandomValues для честной генерации
            const array = new Uint32Array(1)
            crypto.getRandomValues(array)
            const randomIndex = array[0] % participantList.length

            setResult({
                winner: participantList[randomIndex],
                timestamp: Date.now()
            })
            setIsSpinning(false)
        }, 2000) // Длительная анимация для эффекта "колеса фортуны"
    }

    const shareResult = () => {
        if (result === null) return

        const text = `Победитель жребия: ${result.winner}`
        navigator.clipboard.writeText(text)
        alert('Результат скопирован в буфер обмена!')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addParticipant()
        }
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-6">
                {/* Добавление участников */}
                <div>
                    <label htmlFor="newParticipant" className="text-sm font-medium text-[#4B5563] block mb-2">
                        Добавить участника
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="newParticipant"
                            value={newParticipant}
                            onChange={(e) => setNewParticipant(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                            placeholder="Введите имя участника..."
                        />
                        <Button
                            onClick={addParticipant}
                            disabled={!newParticipant.trim() || participantList.length >= 50}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-4"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1">
                        Нажмите Enter или кнопку для добавления. Максимум 50 участников
                    </div>
                </div>

                {/* Список участников */}
                {participantList.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#4B5563]" />
                                <span className="text-sm font-medium text-[#4B5563]">
                                    Участники ({participantList.length})
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAllParticipants}
                                className="text-[#9CA3AF] border-[#D1D5DB] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                                Очистить все
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            <AnimatePresence>
                                {participantList.map((participant, index) => (
                                    <motion.div
                                        key={`${participant}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                                    >
                                        <span className="text-[#1A1A1A] font-medium">
                                            {participant}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeParticipant(index)}
                                            className="text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Кнопка жребия */}
                <div className="text-center">
                    <motion.div
                        animate={isSpinning ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isSpinning ? Infinity : 0 }}
                    >
                        <Button
                            onClick={conductLottery}
                            disabled={isSpinning || participantList.length === 0}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-12 py-4 text-xl font-medium rounded-xl disabled:opacity-50"
                        >
                            {isSpinning ? 'Проводим жребий...' : 'Провести жребий'}
                        </Button>
                    </motion.div>
                </div>

                {/* Результат */}
                <div className="text-center">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key={result.winner}
                                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-4"
                            >
                                <div className="bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-2xl p-8 mx-auto max-w-md">
                                    <div className="text-3xl font-bold text-[#1A1A1A] mb-2">
                                        🎉
                                    </div>
                                    <div className="text-2xl font-bold text-[#1A1A1A] mb-2">
                                        {result.winner}
                                    </div>
                                    <div className="text-lg text-[#4B5563]">
                                        Победитель жребия
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-6xl md:text-7xl font-bold text-[#9CA3AF] mb-4"
                            >
                                🎲
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Дополнительные действия */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={conductLottery}
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
                    <p>Честный результат жребия</p>
                    <p>Используется криптографически стойкий генератор</p>
                </div>
            </div>
        </Card>
    )
}
