import contentfulClient from "./contentful-client"

export const getBundleHandles = async (): Promise<string[]> => {
  const bundles = await contentfulClient.getEntries({
    content_type: "bundle",
    limit: 25,
  })

  return bundles.items.map((b: any) => b.fields.handle)
}
