import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heading, Text, Container, Button, Stack, Box, Flex, Center } from "@chakra-ui/react"
import Separator from "../separator"
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"
import contentfulClient from "@lib/util/contentful-client"
import { formatAmount, useCart } from "medusa-react"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Tab = ({
  active,
  title,
  setActive,
}: {
  active: boolean
  title: string
  setActive: Function
}) => (
  <Button
    bg={active ? "brand.400" : "transparent"}
    color={active ? "white" : "brand.400"}
    border="1px solid var(--chakra-colors-brand-400)"
    borderRadius="xl"
    _hover={{
      bg: active ? "transparent" : "brand.400",
      color: active ? "brand.400" : "white",
    }}
    onClick={() => setActive(title)}
  >
    {title}
  </Button>
)

const TabbedProducts = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState(data.collections[0])
  const [products, setProducts] = useState<Array<any>>([])
  const { cart } = useCart()

  useEffect(() => {
    async function getProducts() {
      const response = await contentfulClient.getEntries({
        content_type: "product",
        limit: 100,
      })
      setProducts(response.items)
    }
    getProducts()
  }, [])

  if (data.collections.length === 0) return <></>

  const arrowStyles = {
    position: "absolute" as "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    width: 30,
    height: 30,
    cursor: "pointer",
  }
  const CustomLeftArrow = (props: any) => (
    <FaArrowCircleLeft
      onClick={props.onClick}
      style={{ ...arrowStyles, left: 0 }}
      color={"var(--chakra-colors-brand-400)"}
    />
  )
  const CustomRightArrow = (props: any) => (
    <FaArrowCircleRight
      onClick={props.onClick}
      style={{ ...arrowStyles, right: 0 }}
      color={"var(--chakra-colors-brand-400)"}
    />
  )

  return (
    <Container textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Center>
        <Text size="sm" maxW="2xl" mt={4}>
          {data.subtitle}
        </Text>
      </Center>
      <Separator />
      <Center>
        <Stack spacing="1rem" mt={10} direction={['column', 'column', 'row']}>
          {data.collections.map((collection: string) => (
            <Tab
              key={collection}
              active={collection === activeTab}
              title={collection}
              setActive={setActiveTab}
            />
          ))}
        </Stack>
      </Center>
      <div style={{ height: "3rem" }} />
      {products?.length &&
        data.collections.map((collection: string) => {
          const productsInCollection = products.map(
            (product) => product.fields
          ).filter(
            (product) => product.collection === collection
          )
          return (
            <Box
              display={collection === activeTab ? "block" : "none"}
              key={collection}
              alignItems="center"
            >
              <Carousel
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
                responsive={{
                  desktop: {
                    breakpoint: {
                      max: 3000,
                      min: 1024
                    },
                    items: productsInCollection.length < 3 ? productsInCollection.length : 3,
                    partialVisibilityGutter: 40
                  },
                  mobile: {
                    breakpoint: {
                      max: 464,
                      min: 0
                    },
                    items: 1,
                    partialVisibilityGutter: 30
                  },
                  tablet: {
                    breakpoint: {
                      max: 1024,
                      min: 464
                    },
                    items: productsInCollection.length < 2 ? productsInCollection.length : 2,
                    partialVisibilityGutter: 30
                  }
                }}
              >
                {productsInCollection
                  .map((product) => {
                    let height = 0
                    let width = 0
                    if (product.thumbnail) {
                      height =
                        product.thumbnail.fields.file.details.image.height
                      width = product.thumbnail.fields.file.details.image.width
                      if (height > 300) {
                        width = (300 / height) * width
                        height = 300
                      }
                    }
                    const price = product.variants[0].fields.prices[0]
                    let priceStr = price
                      ? `${price.currency_code.toUpperCase()}${price.amount}`
                      : ""
                    let originalPriceStr = product.originalPrice
                      ? `${price?.currency_code.toUpperCase() || "HKD"}${product.originalPrice}`
                      : ""
                    if (cart?.region && price) {
                      priceStr = formatAmount({
                        amount: price?.amount || 0,
                        region: cart.region,
                      })
                      if (originalPriceStr) {
                        originalPriceStr = formatAmount({
                          amount: product.originalPrice * 100,
                          region: cart.region,
                        })
                      }
                    }
                    return (
                      <Link
                        href={`/products/${product.handle}`}
                        key={product.handle}
                        passHref
                      >
                        <Box p={10} cursor="pointer">
                          {product.thumbnail && (
                            <Image
                              alt={product?.thumbnail?.fields?.title}
                              key={product?.thumbnail?.fields?.title}
                              style={{
                                maxHeight: 300,
                              }}
                              width={width}
                              height={height}
                              src={`https:${product?.thumbnail?.fields?.file?.url}`}
                            />
                          )}
                          <Text size="sm" mt={4}>
                            {product.title}
                          </Text>
                          <Flex justifyContent="center">
                            {originalPriceStr ? (
                              <Text
                                size="sm"
                                mt={2}
                                textDecorationLine="line-through"
                                color="gray.400"
                                mr={1}
                              >
                                {originalPriceStr}
                              </Text>
                            ) : (
                              <></>
                            )}
                            {product.variants.length ? (
                              <Text size="sm" mt={2} color="brand.400">
                                {priceStr}
                              </Text>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        </Box>
                      </Link>
                    )
                  })}
              </Carousel>
            </Box>
          )
        })}
    </Container>
  )
}

export default TabbedProducts
