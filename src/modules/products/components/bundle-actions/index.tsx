import {
  Box,
  Divider,
  Text,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react"
import { useBundleActions } from "@lib/context/bundle-context"
import { useWishlist } from "@lib/hooks/use-wishlist"
import React from "react"
import { BiHeart } from "react-icons/bi"

type BundleActionsProps = {
  bundle: { [x: string]: any }
}

const BundleActions: React.FC<BundleActionsProps> = ({ bundle }) => {
  const { addToCart, formattedPrices } = useBundleActions()
  const { wishlist, actions } = useWishlist()

  return (
    <div className="flex flex-col gap-y-2">
      <Text color="brand.400">{bundle.type}</Text>
      <h3 className="text-xl-regular">{bundle.name}</h3>

      <Divider />

      <Box my={5}>
        {formattedPrices["original"] && (
          <Text fontSize="md" color="gray.400">
            <Text as="span" fontSize="md">
              原價
            </Text>{" "}
            {formattedPrices["original"]}
          </Text>
        )}
        {formattedPrices["discounted"] && (
          <Text fontSize="2xl" color="brand.400" fontWeight="semibold">
            <Text as="span" fontWeight="normal" fontSize="2xl">
              推廣價
            </Text>{" "}
            {formattedPrices["discounted"]}
          </Text>
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
        加入購物車
      </Button>

      {/* <Text display="flex" alignItems="center" mt={3} color="brand.400" onClick={() => actions.addWishItem()}>
        <BiHeart
          color="var(--chakra-colors-brand-400)"
          size={24}
          className="mr-2"
        />
        加入願望清單
      </Text> */}

      {bundle.discountText && (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          p={6}
          alignItems="start"
          bg="rgba(224, 39, 132, 0.04)"
          my={6}
        >
          <AlertTitle mb={1} fontSize="md" color="brand.400">
            {bundle.discountText.fields.title}
          </AlertTitle>
          <AlertDescription maxWidth="sm" fontSize="md">
            {bundle.discountText.fields.text}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default BundleActions
