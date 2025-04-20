// CheckboxContext.tsx
import { createContext, useContext, useState } from "react"

type CheckboxMap = Record<string, boolean>
type CheckboxContextType = {
  checkboxValues: CheckboxMap
  setCheckboxValue: (id: string, value: boolean) => void
}

const CheckboxContext = createContext<CheckboxContextType | undefined>(undefined)

export const CheckboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkboxValues, setCheckboxValues] = useState<CheckboxMap>({})

  const setCheckboxValue = (id: string, value: boolean) => {
    setCheckboxValues((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <CheckboxContext.Provider value={{ checkboxValues, setCheckboxValue }}>
      {children}
    </CheckboxContext.Provider>
  )
}

export const useCheckboxContext = () => {
  const context = useContext(CheckboxContext)
  if (!context) throw new Error("useCheckboxContext must be used within a CheckboxProvider")
  return context
}
