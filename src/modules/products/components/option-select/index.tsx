import { Button, Text } from "@chakra-ui/react"
import { onlyUnique } from "@lib/util/only-unique"
import { ProductOption } from "@medusajs/medusa"
import { Variant } from "types/medusa"
import React from "react"

type OptionSelectProps = {
  option: ProductOption
  current: string
  updateOption: (option: Record<string, string>) => void
  title: string
  variants: Variant[]
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  variants
}) => {
  const filteredOptions = option.values.map((v) => v.value).filter(onlyUnique)

  return (
    <div className="flex gap-x-3">
      {filteredOptions.map((v) => {
        const variantId: string = option.values.find((val) => val.value === v)![
          "variant_id"
        ]
        const variant = variants.find((variant) => variant.id === variantId)

        return (
          <Button
            onClick={() => updateOption({ [option.id]: v })}
            key={v}
            color={v === current ? "white" : "gray.700"}
            borderColor={v === current ? "brand.400" : "gray.400"}
            borderWidth={1}
            borderRadius={5}
            borderStyle="solid"
            bgColor={v === current ? "brand.400" : "white"}
            px={5}
            py={2}
            display="block"
            height="initial"
            _hover={{
              bgColor: v === current ? "white" : "gray.300",
              color: v === current ? "brand.400" : "gray.700",
            }}
          >
            <Text fontSize="lg">{variant?.title}</Text>
            {variant?.weight && <Text>{variant?.weight}g / 每支</Text>}
          </Button>
        )
      })}
    </div>
  )
}

export default OptionSelect
