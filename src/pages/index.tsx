import Head from "@modules/common/components/head"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/common/components/hero"
import CTA from "@modules/common/components/cta"
import TileSection from "@modules/common/components/tile-section"
import ImageSlider from "@modules/common/components/image-slider"
import Video from "@modules/common/components/video"
import Location from "@modules/common/components/location"
import FaqGroup from "@modules/common/components/faq-group"
import AboutBlock from "@modules/about/components/about-block"
import Layout from "@modules/layout/templates"
import { ReactElement, useEffect, useState } from "react"
import { NextPageWithLayout } from "types/global"
import contentfulClient from "@lib/util/contentful-client"

const Home: NextPageWithLayout = () => {
  const [data, setData] = useState<{[x: string]: any}>({})

  useEffect(() => {
    async function getData() {
      const response = await contentfulClient.getEntries({
        content_type: "page",
        limit: 1,
        "fields.title": "Home"
      })
      setData(response.items[0].fields)
    }
    getData()
  }, [])

  return (
    <>
      {data && (
        <>
          <Head title={data.title} description={data.metaDescription} />
          {data.contentModules &&
            data.contentModules.map((cm: any) => {
              console.log(cm)
              console.log(cm.sys.contentType.sys.id)
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
                // case "tabbedProducts":
                //   return (
                //     <TabbedProducts
                //       key={cm.sys.id}
                //       data={cm.fields}
                //       products={data.products}
                //     />
                //   )
                case "cta":
                  return <CTA key={cm.sys.id} data={cm.fields} />
                case "video":
                  return <Video key={cm.sys.id} data={cm.fields} />
                case "location":
                  return <Location key={cm.sys.id} data={cm.fields} />
                case "faqGroup":
                  return <FaqGroup key={cm.sys.id} data={cm.fields} />
                default:
                  return null
              }
            })}
        </>
      )}
    </>
  )
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default Home
