import ProductActions from "@modules/products/components/product-actions"
import BundleActions from "@modules/products/components/bundle-actions"
import React from "react"
import { Product } from "types/medusa"

type ProductInfoProps = {
  product?: Product
  bundle?: { [x: string]: any }
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, bundle }) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
        <div>
          {product && <ProductActions product={product} />}
          {bundle && <BundleActions bundle={bundle} />}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
