import { ProductProvider } from "@lib/context/product-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import { Product } from "@medusajs/medusa"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import React, { useEffect, useRef, useState } from "react"
import ImageGallery from "../components/image-gallary"
import MobileActions from "../components/mobile-actions"
import contentfulClient from "@lib/util/contentful-client"
import Hero from "@modules/common/components/hero"
import CTA from "@modules/common/components/cta"
import TileSection from "@modules/common/components/tile-section"
import ImageSlider from "@modules/common/components/image-slider"
import Video from "@modules/common/components/video"
import Location from "@modules/common/components/location"
import FaqGroup from "@modules/common/components/faq-group"
import TabbedProducts from "@modules/common/components/tabbed-products"
import AboutBlock from "@modules/about/components/about-block"
import Effects from "@modules/common/components/effects"
import Ingredients from "@modules/common/components/ingredients"
import Instructions from "@modules/common/components/instructions"

type ProductTemplateProps = {
  product: Product
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
  const info = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<{ [x: string]: any }>({})

  const inView = useIntersection(info, "0px")

  useEffect(() => {
    async function getData() {
      const response = await contentfulClient.getEntries({
        content_type: "product",
        limit: 1,
        "fields.medusaId": product.id,
      })
      if (response.items.length) setData(response.items[0].fields)
    }
    getData()
  }, [product.id])

  return (
    <ProductProvider product={product}>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col gap-y-8 w-full small:w-2/3">
          <ImageGallery images={product.images} />
        </div>
        <div
          className="small:sticky small:top-20 w-full py-8 small:py-0 small:max-w-[400px] medium:max-w-[500px] flex flex-col gap-y-12"
          ref={info}
        >
          <ProductInfo product={product} />
          {/* <ProductTabs product={product} /> */}
        </div>
      </div>
      {data.contentModules &&
        data.contentModules.map((cm: any) => {
          switch (cm.sys.contentType.sys.id) {
            case "richText":
              const firstTextElem = data.contentModules.find(
                (cm: any) => cm.sys.contentType.sys.id === "richText"
              )
              return (
                <AboutBlock
                  text={cm.text}
                  isFirstElem={firstTextElem.id === cm.id}
                />
              )
            case "tileSection":
              return <TileSection key={cm.sys.id} data={cm.fields} />
            case "hero":
              return <Hero key={cm.sys.id} data={cm.fields} />
            case "imageSlider":
              return <ImageSlider key={cm.sys.id} data={cm.fields} />
            case "tabbedProducts":
              return <TabbedProducts key={cm.sys.id} data={cm.fields} />
            case "cta":
              return <CTA key={cm.sys.id} data={cm.fields} />
            case "video":
              return <Video key={cm.sys.id} data={cm.fields} />
            case "location":
              return <Location key={cm.sys.id} data={cm.fields} />
            case "faqGroup":
              return <FaqGroup key={cm.sys.id} data={cm.fields} />
            case "relatedProducts":
              return <RelatedProducts key={cm.sys.id} data={cm.fields} />
            case "productEffect":
              return <Effects key={cm.sys.id} data={cm.fields} />
            case "ingredients":
              return <Ingredients key={cm.sys.id} data={cm.fields} />
            case "instructions":
              return <Instructions key={cm.sys.id} data={cm.fields} />
            default:
              return null
          }
        })}
      {/* <div className="content-container my-16 px-6 small:px-8 small:my-32">
        <RelatedProducts product={product} />
      </div> */}
      <MobileActions product={product} show={!inView} />
    </ProductProvider>
  )
}

export default ProductTemplate
