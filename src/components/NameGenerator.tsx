'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CopyButton } from '@/components/ui/copy-button'
import { RefreshCw, Share2 } from 'lucide-react'
import { maleNames, femaleNames } from '@/data/names'

interface GeneratedName {
    name: string
    gender: 'male' | 'female'
    timestamp: number
}

export default function NameGenerator() {
    const [gender, setGender] = useState<'any' | 'male' | 'female'>('any')
    const [name, setName] = useState<GeneratedName | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const generateName = () => {
        setIsGenerating(true)

        // Имитация задержки для анимации
        setTimeout(() => {
            let selectedGender: 'male' | 'female'
            const selectedName: string

            if (gender === 'any') {
                // Случайно выбираем пол
                const array = new Uint32Array(1)
                crypto.getRandomValues(array)
                selectedGender = array[0] % 2 === 0 ? 'male' : 'female'
            } else {
                selectedGender = gender
            }

            // Выбираем имя
            const names = selectedGender === 'male' ? maleNames : femaleNames
            const nameArray = new Uint32Array(1)
            crypto.getRandomValues(nameArray)
            const selectedName = names[nameArray[0] % names.length]

            setName({
                name: selectedName,
                gender: selectedGender,
                timestamp: Date.now()
            })
            setIsGenerating(false)
        }, 800)
    }

    const shareResult = () => {
        if (name === null) return

        const genderText = name.gender === 'male' ? 'мужское' : 'женское'
        const text = `Случайное ${genderText} имя: ${name.name}`
        navigator.clipboard.writeText(text)
        alert('Результат скопирован в буфер обмена!')
    }

    const getCopyText = () => {
        if (name === null) return ""
        const genderText = name.gender === 'male' ? 'мужское' : 'женское'
        return `Случайное ${genderText} имя: ${name.name}`
    }

    return (
        <Card className="p-8 bg-white rounded-2xl shadow-sm border-0">
            <div className="space-y-8">
                {/* Выбор пола */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-[#1A1A1A] mb-4">Выберите пол</h3>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant={gender === 'any' ? 'default' : 'outline'}
                            onClick={() => setGender('any')}
                            className={gender === 'any' ? 'bg-[#111111] text-white' : 'text-[#4B5563] border-[#D1D5DB]'}
                        >
                            Любой
                        </Button>
                        <Button
                            variant={gender === 'male' ? 'default' : 'outline'}
                            onClick={() => setGender('male')}
                            className={gender === 'male' ? 'bg-[#111111] text-white' : 'text-[#4B5563] border-[#D1D5DB]'}
                        >
                            Мужское
                        </Button>
                        <Button
                            variant={gender === 'female' ? 'default' : 'outline'}
                            onClick={() => setGender('female')}
                            className={gender === 'female' ? 'bg-[#111111] text-white' : 'text-[#4B5563] border-[#D1D5DB]'}
                        >
                            Женское
                        </Button>
                    </div>
                </div>

                {/* Основной дисплей имени */}
                <div className="text-center">
                    <AnimatePresence mode="wait">
                        {name ? (
                            <motion.div
                                key={name.name}
                                initial={{ opacity: 0, rotateY: 180 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -180 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-[#FCE7D7] to-[#F9F5FF] rounded-2xl p-8 mx-auto max-w-md">
                                    <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">
                                        {name.name}
                                    </div>
                                    <div className="text-lg text-[#4B5563]">
                                        {name.gender === 'male' ? 'Мужское имя' : 'Женское имя'}
                                    </div>
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
                            onClick={generateName}
                            disabled={isGenerating}
                            className="bg-[#111111] hover:bg-[#333333] text-white px-12 py-4 text-xl font-medium rounded-xl"
                        >
                            {isGenerating ? 'Генерируем...' : 'Получить имя'}
                        </Button>
                    </motion.div>
                </div>

                {/* Дополнительные действия */}
                {name && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={generateName}
                            className="text-[#4B5563] border-[#D1D5DB] hover:bg-[#F9F5FF]"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Ещё раз
                        </Button>
                        <CopyButton
                            text={getCopyText()}
                            className="text-[#4B5563] border-[#D1D5DB] hover:bg-[#F9F5FF]"
                        />
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
                    <p>База содержит популярные русские имена</p>
                    <p>Используется криптографически стойкий генератор</p>
                </div>
            </div>
        </Card>
    )
}
