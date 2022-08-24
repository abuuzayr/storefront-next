import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Heading,
  Text,
  Container,
  Box,
  SimpleGrid,
} from "@chakra-ui/react"
import contentfulClient from "@lib/util/contentful-client"

type RelatedProductsProps = {
  data: {[key: string]: any}
}

const RelatedProducts = ({ data }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Array<any>>([])

  useEffect(() => {
    async function getProducts() {
      const response = await contentfulClient.getEntries({
        content_type: "product",
        "fields.medusaId[in]": data.products.map((product: any) => product.sys.id).join(","),
      })
      setProducts(response.items)
    }
    if (data.products.length) getProducts()
  }, [data.products])

  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        你或許會喜歡
      </Heading>
      <SimpleGrid columns={products.length < 4 ? products.length : 4}>
      {products
        .map(({ fields }) => {
          let height = 0
          let width = 0
          if (fields.thumbnail) {
            height = fields.thumbnail.fields.file.details.image.height
            width = fields.thumbnail.fields.file.details.image.width
            if (height > 300) {
              width = (300 / height) * width
              height = 300
            }
          }
          return (
            <Link
              href={`/products/${fields.handle}`}
              key={fields.handle}
              passHref
            >
              <Box p={10}>
                {fields.thumbnail && (
                  <Image
                    alt={fields.thumbnail.fields.title}
                    key={fields.thumbnail.fields.title}
                    style={{
                      maxHeight: 300,
                    }}
                    width={width}
                    height={height}
                    src={`https:${fields.thumbnail.fields.file.url}`}
                  />
                )}
                <Text size="sm" mt={4}>
                  {fields.title}
                </Text>
                {fields.variants.length ? (
                  <Text size="sm" mt={2}>
                    {fields.variants[0].fields.prices[0] &&
                      fields.variants[0].fields.prices[0].currency_code.toUpperCase()}
                    {fields.variants[0].fields.prices[0] &&
                      fields.variants[0].fields.prices[0].amount}
                  </Text>
                ) : (
                  <></>
                )}
              </Box>
            </Link>
          )
        })}
      </SimpleGrid>
    </Container>
  )
}

export default RelatedProducts
