import { medusaClient } from "@lib/config"
import { formatAmount, useCart, useUpdateCart } from "medusa-react"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useStore } from "./store-context"

interface BundleContext {
  formattedPrices: { [x: string]: string }
  quantity: number
  increaseQuantity: () => void
  decreaseQuantity: () => void
  addToCart: () => void
}

const BundleActionContext = createContext<BundleContext | null>(null)

interface BundleProviderProps {
  children?: React.ReactNode
  bundle: {[x: string]: any}
}

export const BundleProvider = ({
  bundle,
  children,
}: BundleProviderProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [variants, setVariants] = useState<any[]>()

  const { addItem } = useStore()
  const { cart, setCart } = useCart()
  const { mutate } = useUpdateCart(cart!.id)

  useEffect(() => {
    async function getVariants() {
      const vs: any[] = []
      // Get all product variants
      // Choose the variant where quantity is 1
      for (const option of bundle.bundleOptions.map(
        (opt: any) => opt.fields
      )) {
        const data = await medusaClient.products
          .list({ id: option.product.sys.id })
          .then(({ products }) => products[0])
        const optID = data.options.find(o => o.title.toLowerCase() === 'quantity')?.['id']
        const v = data.variants.find(d => d.options.find(o => o.option_id === optID)?.['value'] === `${option.quantity}`)
        vs.push(v)
      }
      setVariants(vs)
    }
    if (!variants) getVariants()
  }, [bundle.bundleOptions, variants])

  const formattedPrices = useMemo(() => {
    if (cart?.region) {
      return {
        original: formatAmount({
          amount: bundle.originalPrice * 100,
          region: cart.region,
        }),
        discounted: formatAmount({
          amount: bundle.price * 100,
          region: cart.region,
        }),
      }
    } else {
      return {
        original: bundle.originalPrice,
        discounted: bundle.price,
      }
    }
  }, [cart, bundle.price, bundle.originalPrice])

  const addToCart = () => {
    if (variants && variants.length) {
      variants.forEach((variant) => {
        addItem({
          variantId: variant.id,
          quantity: 1,
        })
      })
      mutate(
        {
          discounts: [{ code: bundle.discountCode }],
        },
        {
          onSuccess: ({ cart }: { cart: any }) => setCart(cart),
        }
      )
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(quantity - 1)
  }

  return (
    <BundleActionContext.Provider
      value={{
        quantity,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        formattedPrices,
      }}
    >
      {children}
    </BundleActionContext.Provider>
  )
}

export const useBundleActions = () => {
  const context = useContext(BundleActionContext)
  if (context === null) {
    throw new Error(
      "useBundleActionContext must be used within a BundleActionProvider"
    )
  }
  return context
}
