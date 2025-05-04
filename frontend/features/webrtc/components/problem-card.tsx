"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Tag } from "lucide-react"

export default function ProblemCard() {
    // In a real app, you would fetch the problem from your backend
    const problem = {
      id: "LC-704",
      title: "Binary Search",
      categories: ["Algorithms", "Arrays", "Binary Search"],
      url: "https://leetcode.com/problems/binary-search/",
    }
  
    return (
      <Card className="h-full shadow-sm border border-border">
        <CardContent className="p-0 h-full">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4 h-full">
              <div className="flex flex-col justify-center">
                <span className="text-xs text-muted-foreground">Problem</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{problem.id}</span>
                  <span className="font-medium text-sm">{problem.title}</span>
                </div>
              </div>
  
              <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-[300px]">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {problem.categories.map((category, index) => (
                  <span key={index} className="text-xs bg-secondary px-2 py-0.5 rounded-full whitespace-nowrap">
                    {category}
                  </span>
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
  
