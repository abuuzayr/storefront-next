import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { fetchCollectionProducts } from "@pages/collections/[handle]"
import { useCart } from "medusa-react"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "react-query"
import { GoSettings } from "react-icons/go"
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react"

type CollectionTemplateProps = {
  collection: {
    id: string
    title: string
  }
}

const CollectionTemplate: React.FC<CollectionTemplateProps> = ({
  collection,
}) => {
  const { cart } = useCart()
  const { ref, inView } = useInView()

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

  const previews = usePreviews({
    pages: infiniteData?.pages,
    region: cart?.region,
  })

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
        <div className="ml-auto">
          <Menu>
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
              <MenuItem>上架時間: 由新到舊</MenuItem>
              <MenuItem>上架時間: 由舊到新</MenuItem>
              <MenuItem>價格: 由高至低</MenuItem>
              <MenuItem>價格: 由低至高</MenuItem>
            </MenuList>
          </Menu>
        </div>
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
