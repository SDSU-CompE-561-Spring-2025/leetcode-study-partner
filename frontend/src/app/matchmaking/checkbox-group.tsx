"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface CheckboxGroupProps {
  title: string
  options: string[]
  idPrefix: string
  onSelectionChange: (selectedItems: string[]) => void
}

export function CheckboxGroup({ title, options, idPrefix, onSelectionChange }: CheckboxGroupProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // Handle checkbox change
  const handleCheckboxChange = (option: string, checked: boolean) => {
    setSelectedOptions((prev) => {
      if (checked) {
        return [...prev, option]
      } else {
        return prev.filter((item) => item !== option)
      }
    })
  }

  // Update parent component when selections change
  useEffect(() => {
    onSelectionChange(selectedOptions)
  }, [selectedOptions, onSelectionChange])

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>

      <CardContent className="flex-1">
        <ScrollArea className="h-64 md:h-80 lg:h-[30vh] p-3 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, i) => {
              const id = `${idPrefix}-${i}`
              return (
                <label key={id} htmlFor={id} className="flex items-start gap-2 cursor-pointer min-w-0 group relative">
                  <Checkbox
                    id={id}
                    checked={selectedOptions.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange(option, checked === true)}
                    className="mt-0.5" // Align checkbox with the first line of text
                  />
                  <span className="text-sm truncate flex-1 text-left">
                    {option}
                    {/* Tooltip that appears on hover with delay but disappears quickly */}
                    <span className="absolute left-7 top-6 scale-0 transition-all rounded bg-black/80 p-1 text-xs text-white group-hover:scale-100 group-hover:delay-600 delay-0 z-50 max-w-[200px] whitespace-normal break-words">
                      {option}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}