import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { fetchCollectionProducts } from "@pages/collections/[handle]"
import { useCart } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "react-query"
import { GoSettings } from "react-icons/go"
import { Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react"
import { BsCheck } from "react-icons/bs"

type CollectionTemplateProps = {
  collection: {
    id: string
    title: string
  }
  count: number | null
}

const CollectionTemplate: React.FC<CollectionTemplateProps> = ({
  collection,
  count
}) => {
  const { cart } = useCart()
  const { ref, inView } = useInView()
  const [sortBy, setSortBy] = useState("")
  const [sortDir, setSortDir] = useState("")

  const {
    data: infiniteData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    [`get_collection_products`, collection.id, cart?.id],
    ({ pageParam }) =>
      fetchCollectionProducts({
        pageParam,
        id: collection.id,
        cartId: cart?.id,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  let previews = usePreviews({
    pages: infiniteData?.pages,
    region: cart?.region,
  })

  if (sortBy && sortDir) {
    if (sortBy === 'price') {
      previews.sort((a, b) => {
        const priceA: number = a.price?.raw || 0
        const priceB: number = b.price?.raw || 0
        if (priceA === priceB) return 0
        if (!priceA && !priceB) return 0
        if (!priceA && priceB) return -1
        if (!priceB && priceA) return 1
        if (sortDir === 'asc') return priceA - priceB
        return priceB - priceA
      })
    }
    if (sortBy === 'date') {
      previews.sort((a, b) => {
        const dateA: number = new Date(a?.createdAt || new Date()).getTime()
        const dateB: number = new Date(b?.createdAt || new Date()).getTime()
        if (dateA === dateB) return 0
        if (!dateA && !dateB) return 0
        if (!dateA && dateB) return -1
        if (!dateB && dateA) return 1
        if (sortDir === 'asc') return dateA - dateB
        return dateB - dateA
      })
    }
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  return (
    <div className="content-container py-6">
      <div className="flex mb-8 items-center">
        <h1
          style={{ color: "var(--chakra-colors-brand-400)" }}
          className=" text-2xl-regular"
        >
          {collection.title}
        </h1>
        <Flex direction="column" ml="auto" gap={0}>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              variant="ghost"
              bg="white"
              _hover={{ bg: "white" }}
              _active={{
                bg: "white",
              }}
              p={0}
            >
              <div className="flex items-center">
                <GoSettings size={20} color="var(--chakra-colors-brand-400)" />
                <Text color="brand.400" ml={2}>
                  篩選器
                </Text>
              </div>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => {
                setSortBy("date")
                setSortDir("desc")
              }}>上架時間: 由新到舊 {sortBy === "date" && sortDir === "desc" && <Icon as={BsCheck} w={6} h={6} color="brand.400" />}</MenuItem>
              <MenuItem onClick={() => {
                setSortBy("date")
                setSortDir("asc")
              }}>上架時間: 由舊到新 {sortBy === "date" && sortDir === "asc" && <Icon as={BsCheck} w={6} h={6} color="brand.400" />}</MenuItem>
              <MenuItem onClick={() => {
                setSortBy("price")
                setSortDir("desc")
              }}>價格: 由高至低 {sortBy === "price" && sortDir === "desc" && <Icon as={BsCheck} w={6} h={6} color="brand.400" />}</MenuItem>
              <MenuItem onClick={() => {
                setSortBy("price")
                setSortDir("asc")
              }}>價格: 由低至高 {sortBy === "price" && sortDir === "asc" && <Icon as={BsCheck} w={6} h={6} color="brand.400" />}</MenuItem>
            </MenuList>
          </Menu>
          {count !== null && <Text size="sm" color="gray.500">{count} 產品</Text>}
        </Flex>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {previews.map((p) => (
          <li key={p.id}>
            <ProductPreview {...p} />
          </li>
        ))}
        {isLoading &&
          !previews.length &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
        {isFetchingNextPage &&
          repeat(getNumberOfSkeletons(infiniteData?.pages)).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
      </ul>
      <div
        className="py-16 flex justify-center items-center text-small-regular text-gray-700"
        ref={ref}
      >
        <span ref={ref}></span>
      </div>
    </div>
  )
}

export default CollectionTemplate
