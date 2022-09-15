import React, { createContext, useEffect, useState } from "react"
import { useCart } from "medusa-react"
import { axiosClient } from "@lib/config"

const defaultWishlistContext = {
  wishlist: {
    id: "",
    items: [
      {
        product: {
          id: "1",
          title: "Medusa Tote",
          thumbnail:
            "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tshirt.png",
          },
          product_id: "",
        },
      ],
  },
  loading: false,
  actions: {
    addWishItem: async (id: any) => {},
    removeWishItem: async (id: any) => {},
  },
}

const WishlistContext = createContext(defaultWishlistContext)
export default WishlistContext

const WISHLIST_ID = "wishlist_id"
const isBrowser = typeof window !== "undefined"

export const WishlistProvider = (props: any) => {
  const [wishlist, setWishlist] = useState<any>(defaultWishlistContext.wishlist)
  const [loading, setLoading] = useState<boolean>(defaultWishlistContext.loading)
  const { cart } = useCart()
  const { region } = cart!

  const setWishlistItem = (wishlist: any) => {
    if (isBrowser) {
      localStorage.setItem(WISHLIST_ID, wishlist.id)
    }
    setWishlist(wishlist)
  }

  useEffect(() => {
    const initializeWishlist = async () => {
      const existingWishlistId = isBrowser
        ? localStorage.getItem(WISHLIST_ID)
        : null

      if (existingWishlistId && existingWishlistId !== "undefined") {
        try {
          const { data } = await axiosClient.get(
            `/store/wishlist/${existingWishlistId}`
          )

          if (data) {
            setWishlistItem(data)
            return
          }
        } catch (e) {
          localStorage.setItem(WISHLIST_ID, "")
        }
      }

      if (region) {
        try {
          const { data } = await axiosClient.post("/store/wishlist", {
            region_id: region.id,
          })

          setWishlistItem(data)
          setLoading(false)
        } catch (e) {
          console.log(e)
        }
      }
    }

    initializeWishlist()
  }, [region])

  const addWishItem = async (product_id: any) => {
    setLoading(true)
    try {
      const { data } = await axiosClient.post(
        `/store/wishlist/${wishlist.id}/wish-item`,
        { product_id }
      )
      setWishlistItem(data)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  const removeWishItem = async (id: any) => {
    setLoading(true)
    try {
      const { data } = await axiosClient.delete(
        `/store/wishlist/${wishlist.id}/wish-item/${id}`
      )
      console.log("data: ", data)
      if (data) setWishlistItem(data)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <WishlistContext.Provider
      {...props}
      value={{
        ...defaultWishlistContext,
        loading,
        wishlist,
        actions: {
          addWishItem,
          removeWishItem,
        },
      }}
    />
  )
}
