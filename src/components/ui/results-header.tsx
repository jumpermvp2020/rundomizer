"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { ShareButton } from "@/components/ui/share-button"
import { RefreshCw } from "lucide-react"

interface ResultsHeaderProps {
    title: string
    count: number
    onRegenerate: () => void
    copyText: string
    shareText: string
    shareTitle: string
}

export function ResultsHeader({
    title,
    count,
    onRegenerate,
    copyText,
    shareText,
    shareTitle
}: ResultsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
                {title} ({count})
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRegenerate}
                    className="text-[#4B5563] border-[#D1D5DB] text-xs px-2 py-1 h-7"
                >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Ещё раз</span>
                    <span className="sm:hidden">Ещё</span>
                </Button>
                <CopyButton
                    text={copyText}
                    size="sm"
                    className="text-[#4B5563] border-[#D1D5DB] text-xs px-2 py-1 h-7"
                >
                    <span className="hidden sm:inline">Копировать</span>
                    <span className="sm:hidden">Копия</span>
                </CopyButton>
                <ShareButton
                    text={shareText}
                    title={shareTitle}
                    size="sm"
                    className="text-[#4B5563] border-[#D1D5DB] text-xs px-2 py-1 h-7"
                >
                    <span className="hidden sm:inline">Поделиться</span>
                    <span className="sm:hidden">Шарить</span>
                </ShareButton>
            </div>
        </div>
    )
}
