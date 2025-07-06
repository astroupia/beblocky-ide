"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type AIContextType = {
  analyzeCode: (code: string, slideContent: string) => Promise<string>
  isAnalyzing: boolean
  getHelpWithCode: (code: string, question: string) => Promise<string>
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeCode = async (code: string, slideContent: string): Promise<string> => {
    setIsAnalyzing(true)

    try {
      // This would be replaced with actual AI integration
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate AI analysis
      const analysis = `
        I've analyzed your code and here's my feedback:
        
        Strengths:
        - Good HTML structure with proper semantic elements
        - CSS is well-organized
        
        Areas for improvement:
        - Consider adding more comments to your JavaScript
        - The function on line 12 could be optimized
        
        Based on the current lesson about "${slideContent}", 
        I recommend focusing on improving your use of event listeners.
      `

      return analysis
    } catch (error) {
      console.error("Error analyzing code:", error)
      return "Sorry, I encountered an error while analyzing your code. Please try again."
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getHelpWithCode = async (code: string, question: string): Promise<string> => {
    try {
      // This would be replaced with actual AI integration
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate AI help
      return `
        Based on your question "${question}" and looking at your code, 
        I'd suggest the following approach:
        
        Try using a different CSS selector to target that specific element.
        For example:
        
        \`\`\`css
        .container > .item {
          color: #892FFF;
        }
        \`\`\`
        
        This will only select direct children with the class "item" inside elements with the class "container".
      `
    } catch (error) {
      console.error("Error getting help with code:", error)
      return "Sorry, I encountered an error while trying to help. Please try again."
    }
  }

  return <AIContext.Provider value={{ analyzeCode, isAnalyzing, getHelpWithCode }}>{children}</AIContext.Provider>
}

export const useAI = (): AIContextType => {
  const context = useContext(AIContext)

  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider")
  }

  return context
}
