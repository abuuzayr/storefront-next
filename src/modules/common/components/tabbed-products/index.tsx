import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heading, Text, Container, Button, HStack, Box } from "@chakra-ui/react"
import Separator from "../separator"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"
import contentfulClient from "@lib/util/contentful-client"

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
  const settings = {
    showIndicators: false,
    showStatus: false,
    showThumbs: false,
    renderArrowPrev: (onClickHandler: any, hasPrev: any, label: any) => (
      <FaArrowCircleLeft
        onClick={onClickHandler}
        style={{ ...arrowStyles, left: -50 }}
        color={hasPrev ? "var(--chakra-colors-brand-400)" : "gray.400"}
      />
    ),
    renderArrowNext: (onClickHandler: any, hasNext: any, label: any) => (
      <FaArrowCircleRight
        onClick={onClickHandler}
        style={{ ...arrowStyles, right: -50 }}
        color={hasNext ? "var(--chakra-colors-brand-400)" : "gray.400"}
      />
    ),
    centerMode: true,
    centerSlidePercentage: 25,
  }

  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Text size="sm" maxW="2xl" mt={4}>
        {data.subtitle}
      </Text>
      <Separator />
      <HStack spacing="1rem" mt={10}>
        {data.collections.map((collection: string) => (
          <Tab
            key={collection}
            active={collection === activeTab}
            title={collection}
            setActive={setActiveTab}
          />
        ))}
      </HStack>
      <div style={{ height: "3rem" }} />
      {products?.length &&
        data.collections.map((collection: string) => (
          <Box
            display={collection === activeTab ? "block" : "none"}
            key={collection}
          >
            <Carousel {...settings}>
              {products
                .map((product) => product.fields)
                .filter((product) => product.collection === collection)
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
                  return (
                    <Link
                      href={`/products/${product.handle}`}
                      key={product.handle}
                      passHref
                    >
                      <Box p={10}>
                        {product.thumbnail && (
                          <Image
                            alt={product.thumbnail.fields.title}
                            key={product.thumbnail.fields.title}
                            style={{
                              maxHeight: 300,
                            }}
                            width={width}
                            height={height}
                            src={`https:${product.thumbnail.fields.file.url}`}
                          />
                        )}
                        <Text size="sm" mt={4}>
                          {product.title}
                        </Text>
                        {product.variants.length ? (
                          <Text size="sm" mt={2}>
                            {product.variants[0].fields.prices[0] &&
                              product.variants[0].fields.prices[0].currency_code.toUpperCase()}
                            {product.variants[0].fields.prices[0] &&
                              product.variants[0].fields.prices[0].amount}
                          </Text>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Link>
                )})}
            </Carousel>
          </Box>
        ))}
    </Container>
  )
}

export default TabbedProducts
