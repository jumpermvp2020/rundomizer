'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Share2 } from 'lucide-react'

interface DiceResult {
    value: number
    timestamp: number
}

interface RollResult {
    dice: DiceResult[]
    total: number
    timestamp: number
}

export default function DiceRoll() {
    const [count, setCount] = useState(1)
    const [rollResult, setRollResult] = useState<RollResult | null>(null)
    const [isRolling, setIsRolling] = useState(false)

    const rollDice = () => {
        if (count > 6) {
            alert('Максимум 6 костей за раз')
            return
        }

        setIsRolling(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            const dice: DiceResult[] = []
            let total = 0

            for (let i = 0; i < count; i++) {
                // Используем crypto.getRandomValues для честной генерации
                const array = new Uint32Array(1)
                crypto.getRandomValues(array)
                const value = 1 + (array[0] % 6)
                dice.push({
                    value,
                    timestamp: Date.now()
                })
                total += value
            }

            setRollResult({
                dice,
                total,
                timestamp: Date.now()
            })
            setIsRolling(false)
        }, 1500)
    }

    const shareResult = () => {
        if (rollResult === null) return

        const diceValues = rollResult.dice.map(d => d.value).join(', ')
        const text = `Бросок кости: ${diceValues} (сумма: ${rollResult.total})`
        navigator.clipboard.writeText(text)
        alert('Результат скопирован в буфер обмена!')
    }

    const getDiceFace = (value: number) => {
        const faces = {
            1: '⚀',
            2: '⚁',
            3: '⚂',
            4: '⚃',
            5: '⚄',
            6: '⚅'
        }
        return faces[value as keyof typeof faces]
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-6">
                {/* Настройки */}
                <div className="max-w-xs mx-auto">
                    <Label htmlFor="count" className="text-sm font-medium text-[#4B5563]">
                        Количество костей
                    </Label>
                    <Input
                        id="count"
                        type="number"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="mt-1"
                        placeholder="1"
                        min="1"
                        max="6"
                    />
                </div>

                {/* Кости */}
                <div className="text-center">
                    <div className="flex justify-center gap-4 flex-wrap">
                        <AnimatePresence>
                            {rollResult ? (
                                rollResult.dice.map((die, index) => (
                                    <motion.div
                                        key={`${die.value}-${die.timestamp}-${index}`}
                                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        className="w-16 h-16 bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-xl flex items-center justify-center text-3xl font-bold text-[#1A1A1A] shadow-sm"
                                    >
                                        {getDiceFace(die.value)}
                                    </motion.div>
                                ))
                            ) : (
                                Array.from({ length: count }, (_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-16 h-16 bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-xl flex items-center justify-center text-3xl font-bold text-[#9CA3AF] shadow-sm"
                                    >
                                        ?
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Результат */}
                    {rollResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6"
                        >
                            <div className="text-2xl font-bold text-[#1A1A1A] mb-2">
                                Сумма: {rollResult.total}
                            </div>
                            <div className="text-sm text-[#9CA3AF]">
                                Результат броска {count} костей
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Кнопка броска */}
                <div className="text-center">
                    <motion.div
                        animate={isRolling ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isRolling ? Infinity : 0 }}
                    >
                        <Button
                            onClick={rollDice}
                            disabled={isRolling}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-12 py-4 text-xl font-medium rounded-xl"
                        >
                            {isRolling ? 'Бросаем...' : 'Бросить кости'}
                        </Button>
                    </motion.div>
                </div>

                {/* Дополнительные действия */}
                {rollResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={rollDice}
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
                    <p>Честный результат броска кости</p>
                    <p>Используется криптографически стойкий генератор</p>
                </div>
            </div>
        </Card>
    )
}
