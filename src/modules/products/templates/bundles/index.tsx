import { BundleProvider } from "@lib/context/bundle-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import { Product } from "@medusajs/medusa"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import React, { useEffect, useRef, useState } from "react"
import ImageGallery from "../../components/image-gallary"

const ProductBundleTemplate = ({ data }: { data: any }) => {
  const info = useRef<HTMLDivElement>(null)

  const inView = useIntersection(info, "0px")

  const image = data.image.fields.file
  if (!image.url.startsWith('https:')) {
    image.url = `https:${image.url}`
  }

  return (
    <BundleProvider bundle={data}>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col gap-y-8 w-full">
          <ImageGallery images={[image]} />
        </div>
        <div
          className="small:sticky small:top-20 w-full py-8 small:py-0 small:max-w-[400px] medium:max-w-[500px] flex flex-col gap-y-12"
          ref={info}
        >
          <ProductInfo bundle={data} />
          {/* <ProductTabs product={product} /> */}
        </div>
      </div>
      <RelatedProducts
        data={{
          products: data.bundleOptions.map((opt: any) => opt.fields.product),
        }}
      />
      {/* <MobileActions product={product} show={!inView} /> */}
    </BundleProvider>
  )
}

export default ProductBundleTemplate
