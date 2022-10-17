import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import { getBlogPostSlugs } from "@lib/util/get-blog-post-slugs"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import BlogPostTemplate from "@modules/blog-posts/templates"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "types/global"
import contentfulClient from "@lib/util/contentful-client"

interface Params extends ParsedUrlQuery {
  slug: string
}

const fetchBlogPost = async (slug: string) => {
  return await contentfulClient.getEntries({
    content_type: "blogPost",
    limit: 1,
    "fields.slug": slug,
  })
}

const ProductPage: NextPageWithLayout<PrefetchedPageProps> = ({ notFound }) => {
  const { query, isFallback, replace } = useRouter()
  const slug = typeof query.slug === "string" ? query.slug : ""

  const { data, isError, isLoading, isSuccess } = useQuery(
    [`get_blog_post`, slug],
    () => fetchBlogPost(slug),
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
    const postData = data.items[0].fields
    return (
      <>
        <Head
          description={postData.caption}
          title={postData.title}
          image={`https:${postData?.image?.fields?.file?.url || ""}`}
        />
        <BlogPostTemplate data={postData} />
      </>
    )
  }

  return <></>
}

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await getBlogPostSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery([`get_blog_post`, slug], () =>
    fetchBlogPost(slug)
  )

  const queryData = await queryClient.getQueryData([`get_blog_post`, slug])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
      revalidate: 10,
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
