import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import { getBundleHandles } from "@lib/util/get-bundle-handles"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import ProductBundleTemplate from "@modules/products/templates/bundles"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "types/global"
import contentfulClient from "@lib/util/contentful-client"

interface Params extends ParsedUrlQuery {
  handle: string
}

const fetchBundle = async (handle: string) => {
  const response = await contentfulClient.getEntries({
    content_type: "bundle",
    limit: 1,
    "fields.handle": handle,
  })
  console.log(response)
  return response.items[0].fields
}

const ProductPage: NextPageWithLayout<PrefetchedPageProps> = ({ notFound }) => {
  const { query, isFallback, replace } = useRouter()
  const handle = typeof query.handle === "string" ? query.handle : ""
  console.log(handle)

  const { data, isError, isLoading, isSuccess } = useQuery(
    [`get_bundle`, handle],
    () => fetchBundle(handle),
    {
      enabled: handle.length > 0,
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
    console.log(data)
    return (
      <>
        <Head
          description={data.description}
          title={data.name}
          image={data.thumbnail}
        />
        <ProductBundleTemplate data={data} />
      </>
    )
  }

  return <></>
}

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = await getBundleHandles()
  console.log("handles: ", handles)
  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const handle = context.params?.handle as string

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery([`get_product`, handle], () =>
    fetchBundle(handle)
  )

  const queryData = await queryClient.getQueryData([`get_product`, handle])

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

export default ProductPage
