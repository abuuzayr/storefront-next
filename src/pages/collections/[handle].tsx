import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import { getCollections } from "@lib/util/get-collections"
import CollectionTemplate from "@modules/collections/templates"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import SkeletonCollectionPage from "@modules/skeletons/templates/skeleton-collection-page"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement, useEffect, useState } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "../../types/global"

interface Params extends ParsedUrlQuery {
  handle: string
}

const fetchCollection = async (handle: string) => {
  const collections = await getCollections()
  const collection = collections.find(collection => collection.handle === handle)
  if (collection) {
    return await medusaClient.collections.retrieve(collection['id']).then(({ collection }) => ({
      id: collection.id,
      title: collection.title,
    }))
  }
}

export const fetchCollectionProducts = async ({
  pageParam = 0,
  id,
  cartId,
}: {
  pageParam?: number
  id: string
  cartId?: string
}) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 12,
    offset: pageParam,
    collection_id: [id],
    cart_id: cartId,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  }
}

const CollectionPage: NextPageWithLayout<PrefetchedPageProps> = ({
  notFound,
}) => {
  const { query, isFallback, replace } = useRouter()
  const handle = typeof query.handle === "string" ? query.handle : ""
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function getProductCount() {
      const collections = await getCollections()
      const collection = collections.find(collection => collection.handle === handle)
      if (collection) {
        const productCount = await medusaClient.products
          .list({ collection_id: [collection.id] })
          .then(({ count }) => count)
        setCount(productCount)
      }
    }
    if (count === null && handle) {
      getProductCount()
    }

  }, [count, handle])

  const { data, isError, isSuccess, isLoading } = useQuery(
    ["get_collection", handle],
    () => fetchCollection(handle)
  )

  if (notFound) {
    if (IS_BROWSER) {
      replace("/404")
    }

    return <SkeletonCollectionPage />
  }

  if (isError) {
    replace("/404")
  }

  if (isFallback || isLoading || !data) {
    return <SkeletonCollectionPage />
  }

  if (isSuccess) {
    return (
      <>
        <Head title={data.title} description={`${data.title} collection`} />
        <CollectionTemplate collection={data} count={count} />
      </>
    )
  }

  return <></>
}

CollectionPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = (await getCollections()).map(({ handle }) => handle)

  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient()
  const handle = context.params?.handle as string

  await queryClient.prefetchQuery(["get_collection", handle], () =>
    fetchCollection(handle)
  )

  const collections = await getCollections()
  const collection = collections.find(
    (collection) => collection.handle === handle
  )
  if (collection) {
    await queryClient.prefetchInfiniteQuery(
      ["get_collection_products", handle],
      ({ pageParam }) => fetchCollectionProducts({ pageParam, id: collection.id }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )
  }


  const queryData = await queryClient.getQueryData([`get_collection`, handle])

  if (!queryData || !collection) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  return {
    props: {
      // Work around see – https://github.com/TanStack/query/issues/1458#issuecomment-747716357
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      notFound: false,
    },
    revalidate: 10,
  }
}

export default CollectionPage
