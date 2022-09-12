import useToggleState from "@lib/hooks/use-toggle-state"
import { createContext, useContext, useEffect, useState } from "react"

interface WishlistDropdownContext {
  state: boolean
  open: () => void
  timedOpen: () => void
  close: () => void
}

export const WishlistDropdownContext = createContext<WishlistDropdownContext | null>(
  null
)

export const WishlistDropdownProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { state, close, open } = useToggleState()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  return (
    <WishlistDropdownContext.Provider
      value={{ state, close, open: openAndCancel, timedOpen }}
    >
      {children}
    </WishlistDropdownContext.Provider>
  )
}

export const useWishlistDropdown = () => {
  const context = useContext(WishlistDropdownContext)

  if (context === null) {
    throw new Error(
      "useWishlistDropdown must be used within a WishlistDropdownProvider"
    )
  }

  return context
}
