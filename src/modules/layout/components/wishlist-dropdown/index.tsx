import { Popover, Transition, Menu } from "@headlessui/react"
import { useWishlistDropdown } from "@lib/context/wishlist-dropdown-context"
import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import Trash from "@modules/common/icons/trash"
import Thumbnail from "@modules/products/components/thumbnail"
import { useCart } from "medusa-react"
import { Fragment } from "react"
import { BiHeart } from "react-icons/bi"
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
} from "@chakra-ui/react"
import { useWishlist } from "@lib/hooks/use-wishlist"

const WishlistDropdown = () => {
  const { wishlist, actions } = useWishlist()
  const { cart, totalItems } = useCart()
  const items = useEnrichedLineItems()
  const { state, open, close } = useWishlistDropdown()

  return (
    <div className="h-full z-50" onMouseEnter={open} onMouseLeave={close}>
      <Popover className="relative h-full">
        <Popover.Button className="h-full">
          <Flex alignItems="center" style={{ padding: "0 16px" }}>
            <BiHeart
              size={24}
              style={{ color: "var(--chakra-colors-brand-400)" }}
            />
          </Flex>
        </Popover.Button>
        <Transition
          show={state}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+5px)] right-0 bg-white border border-gray-200 w-[382px] text-gray-900 z-50"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Wish List</h3>
            </div>
            <div className="p-0 w-96">
              {!wishlist.items || wishlist.items.length < 1 ? (
                <Flex alignItems="center" justifyContent="center" mb={3}>
                  <Text>Your wish list is empty</Text>
                </Flex>
              ) : (
                <TableContainer>
                  <Table variant="simple">
                    <Thead height={0}>
                      <Tr>
                        <Th width="20%" p={0}></Th>
                        <Th width="60%" p={0}></Th>
                        <Th width="10%" p={0}></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wishlist.items?.map(({ product }, i) => (
                        <Tr key={i}>
                          <Td p={2}>
                            <Thumbnail thumbnail={product.thumbnail} size="full" />
                          </Td>
                          <Td p={2}>
                            <p className="font-medium text-sm">{product.title}</p>
                          </Td>
                          <Td p={2}>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => actions.removeWishItem(product.id)}
                            >
                              <Trash size={14} />
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default WishlistDropdown
