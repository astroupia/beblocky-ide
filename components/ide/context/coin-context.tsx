"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type CoinContextType = {
  coins: number
  addCoins: (amount: number) => void
  deductCoins: (amount: number) => void
}

const CoinContext = createContext<CoinContextType | undefined>(undefined)

export function CoinProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    // Load coins from localStorage on initial render
    const savedCoins = localStorage.getItem("coins")
    if (savedCoins) {
      setCoins(Number(savedCoins))
    }
  }, [])

  useEffect(() => {
    // Save coins to localStorage when they change
    localStorage.setItem("coins", coins.toString())
  }, [coins])

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount)
  }

  const deductCoins = (amount: number) => {
    setCoins((prev) => Math.max(0, prev - amount))
  }

  return <CoinContext.Provider value={{ coins, addCoins, deductCoins }}>{children}</CoinContext.Provider>
}

export const useCoin = (): CoinContextType => {
  const context = useContext(CoinContext)

  if (context === undefined) {
    throw new Error("useCoin must be used within a CoinProvider")
  }

  return context
}
