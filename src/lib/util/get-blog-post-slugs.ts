import contentfulClient from "@lib/util/contentful-client"

export const getBlogPostSlugs = async (): Promise<string[]> => {
  const blogPostEntries = await contentfulClient.getEntries({
    content_type: "product",
  })

  const slugs: string[] = []
  
  for (const blogPost of blogPostEntries.items.map(item => item.fields)) {
    if (blogPost.slug) {
      slugs.push(blogPost.slug)
    }
  }

  return slugs
}
