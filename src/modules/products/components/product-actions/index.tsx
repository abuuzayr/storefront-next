import {
  Box,
  Divider,
  Text,
  Button,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Link as CLink
} from "@chakra-ui/react"
import { useProductActions } from "@lib/context/product-context"
import useProductPrice from "@lib/hooks/use-product-price"
import OptionSelect from "@modules/products/components/option-select"
import clsx from "clsx"
import Link from "next/link"
import React, { ReactNode, useEffect, useMemo, useState } from "react"
import { Product } from "types/medusa"
import contentfulClient from "@lib/util/contentful-client"
import { BiHeart } from "react-icons/bi"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { INLINES, BLOCKS, MARKS, Document } from "@contentful/rich-text-types"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

type ProductActionsProps = {
  product: Product
}

const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: ReactNode) => <b className="font-bold">{text}</b>,
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node: any, children: any) => {
      const { uri } = node.data
      return (
        <CLink href={uri} textDecoration="underline" color="brand.400">
          {children}
        </CLink>
      )
    },
    [BLOCKS.HEADING_1]: (node: any, children: any) => {
      return (
        <Heading as="h1" fontSize={42} m={4}>
          {children}
        </Heading>
      )
    },
    [BLOCKS.HEADING_2]: (node: any, children: any) => {
      return (
        <Heading as="h2" size="xl" textAlign="left" color="brand.400" my={4}>
          {children}
        </Heading>
      )
    },
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
      return (
        <Text color="gray.600" lineHeight={6}>{children}</Text>
      )
    }
  },
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { updateOptions, addToCart, options, inStock, variant } =
    useProductActions()
  const [contentfulData, setContentfulData] = useState<any>()

  useEffect(() => {
    async function getContentfulData() {
      const response = await contentfulClient.getEntries({
        content_type: "product",
        limit: 1,
        "fields.medusaId": product.id,
      })
      setContentfulData(response.items[0].fields)
    }
    getContentfulData()
  }, [product.id])

  const price = useProductPrice({ id: product.id, variantId: variant?.id })

  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  return (
    <div className="flex flex-col gap-y-2">
      <Text color="brand.400">{product.type.value}</Text>
      <h3 className="text-xl-regular">{product.title}</h3>

      <Text>
        來源地:
        <Text as="span" color="brand.400" ml={2}>
          {contentfulData && contentfulData.origin}
        </Text>
      </Text>
      <Text mt={-2}>
        類別:
        <Text as="span" color="brand.400" ml={2}>
          {product.collection.title}
        </Text>
      </Text>

      <Divider />

      <Text>選項</Text>
      <div className="flex flex-col gap-y-6">
        {product.options.map((option) => {
          return (
            <div key={option.id}>
              <OptionSelect
                option={option}
                current={options[option.id]}
                updateOption={updateOptions}
                title={option.title}
                variants={product.variants}
              />
            </div>
          )
        })}
      </div>

      <Box my={5}>
        {selectedPrice ? (
          <div className="flex flex-col text-gray-700">
            <Text fontSize="3xl" color="brand.400" fontWeight="semibold">
              {selectedPrice.calculated_price}
            </Text>
            {selectedPrice.price_type === "sale" && (
              <>
                <p>
                  {/* <span className="text-gray-500">Original: </span> */}
                  <span className="line-through">
                    {selectedPrice.original_price}
                  </span>
                </p>
                <span className="text-rose-600">
                  -{selectedPrice.percentage_diff}%
                </span>
              </>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </Box>

      <Button
        onClick={addToCart}
        bg="brand.400"
        color="white"
        borderRadius={0}
        borderColor="brand.400"
        borderWidth={1}
        borderStyle="solid"
        py={6}
        _hover={{
          bg: "white",
          color: "brand.400",
        }}
      >
        {!inStock ? "Out of stock" : "加入購物車"}
      </Button>

      <Text display="flex" alignItems="center" mt={3} color="brand.400">
        <BiHeart
          color="var(--chakra-colors-brand-400)"
          size={24}
          className="mr-2"
        />
        加入願望清單
      </Text>

      {contentfulData && (
        <Accordion my={10} allowToggle>
          {contentfulData.fullProductDescription.map((desc: any) => (
            <AccordionItem border="none" key={desc.sys.id}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton pl={0}>
                    {isExpanded ? (
                      <FaArrowUp size={14} style={{ color: "gray" }} />
                    ) : (
                      <FaArrowDown size={14} style={{ color: "gray" }} />
                    )}
                    <Heading as="h3" color="gray" fontSize={14} ml={4}>
                      {desc.fields.title}
                    </Heading>
                  </AccordionButton>
                  <AccordionPanel pl={7} py={5}>
                    <Heading as="h4" fontSize={14} color="brand.400" pb={4}>
                      {desc.fields.subtitle}
                    </Heading>
                    {documentToReactComponents(
                      desc.fields.richText,
                      renderOptions
                    )}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

export default ProductActions
