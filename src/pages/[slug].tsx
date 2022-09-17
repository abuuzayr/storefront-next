import { IS_BROWSER } from "@lib/constants"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "types/global"
import contentfulClient from "@lib/util/contentful-client"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"
import Hero from "@modules/common/components/hero"
import CTA from "@modules/common/components/cta"
import TileSection from "@modules/common/components/tile-section"
import ImageSlider from "@modules/common/components/image-slider"
import Video from "@modules/common/components/video"
import Location from "@modules/common/components/location"
import FaqGroup from "@modules/common/components/faq-group"
import AboutBlock from "@modules/about/components/about-block"
import TabbedProducts from "@modules/common/components/tabbed-products"

interface Params extends ParsedUrlQuery {
  slug: string
}

const fetchPage = async (slug: string) => {
  return await contentfulClient
    .getEntries({
      content_type: "page",
      limit: 1,
      "fields.slug": slug,
    })
    .then(({ items }) => items[0].fields)
}

const PageByHandle: NextPageWithLayout<PrefetchedPageProps> = ({ notFound }) => {
  const { query, isFallback, replace } = useRouter()
  const slug = typeof query.slug === "string" ? query.slug : ""

  const { data, isError, isLoading, isSuccess } = useQuery(
    [`get_page`, slug],
    () => fetchPage(slug),
    {
      enabled: slug.length > 0,
      keepPreviousData: true,
    }
  )
  
  if (notFound) {
    if (IS_BROWSER) {
      replace("/404")
    }

    return <SkeletonProductPage />
  }

  if (isFallback || isLoading || !data) {
    return <SkeletonProductPage />
  }

  if (isError) {
    replace("/404")
  }

  if (isSuccess) {
    return (
      <>
        <Head title={data.title} />
        {data.contentModules &&
          data.contentModules.map((cm: any) => {
            switch (cm.sys.contentType.sys.id) {
              case "richText":
                const firstTextElem = data.contentModules.find(
                  (cm: any) => cm.sys.contentType.sys.id === "richText"
                )
                return (
                  <AboutBlock
                    text={cm.fields.text}
                    isFirstElem={firstTextElem.fields.id === cm.fields.id}
                  />
                )
              case "tileSection":
                return <TileSection key={cm.sys.id} data={cm.fields} />
              case "hero":
                return <Hero key={cm.sys.id} data={cm.fields} />
              case "imageSlider":
                return <ImageSlider key={cm.sys.id} data={cm.fields} />
              case "tabbedProducts":
                return (
                  <TabbedProducts
                    key={cm.sys.id}
                    data={cm.fields}
                  />
                )
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
    )
  }

  return <></>
}

PageByHandle.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const pages = await contentfulClient.getEntries({
    content_type: "page",
    limit: 100,
    "fields.title[nin]": "Home"
  })
  return {
    paths: pages.items.map(({ fields }) => ({ params: { slug: fields.slug } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery([`get_page`, slug], () =>
    fetchPage(slug)
  )

  const queryData = await queryClient.getQueryData([`get_page`, slug])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      notFound: false,
    },
    revalidate: 10,
  }
}

export default PageByHandle
