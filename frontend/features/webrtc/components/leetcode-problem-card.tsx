"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Tag } from "lucide-react"

export interface LeetCodeProblem {
  id: string
  title: string
  categories: string[]
  url: string
}

export default function LeetCodeProblemCard({ problem }: { problem: LeetCodeProblem }) {
  return (
    <Card className="w-full shadow-sm border border-border">
      <CardContent className="p-0">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Problem</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{problem.id}</span>
                <span className="font-medium text-sm">{problem.title}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-[300px]">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {problem.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs whitespace-nowrap">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs shrink-0"
            onClick={() => window.open(problem.url, "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Problem
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
