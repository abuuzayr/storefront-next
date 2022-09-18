import { useStore } from "@lib/context/store-context"
import { LineItem, Region } from "@medusajs/medusa"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import NativeSelect from "@modules/common/components/native-select"
import Trash from "@modules/common/icons/trash"
import Thumbnail from "@modules/products/components/thumbnail"
import { CalculatedVariant } from "types/medusa"
import contentfulClient from "@lib/util/contentful-client"
import { useEffect, useState } from "react"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
}

const Item = ({ item, region }: ItemProps) => {
  const { updateItem, deleteItem } = useStore()
  const [contentfulData, setContentfulData] = useState<any>()

  useEffect(() => {
    async function getContentfulData() {
      const response = await contentfulClient.getEntries({
        content_type: "product",
        limit: 1,
        "fields.medusaId": item.variant.product.id,
      })
      if (response.items.length) setContentfulData(response.items[0].fields)
    }
    getContentfulData()
  }, [item.variant.product.id])

  const isHidden = item.variant.product.tags
    .map((tag) => tag.value)
    .includes("hidden")

  return (
    <div className="grid grid-cols-[122px_1fr] gap-x-4">
      <div className="w-[122px]">
        <Thumbnail thumbnail={item.thumbnail} size="full" />
      </div>
      <div className="text-base-regular flex flex-col gap-y-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span>{item.title}</span>
            <LineItemOptions variant={item.variant} />
          </div>
          {!isHidden &&
            <NativeSelect
              value={item.quantity}
              onChange={(value) =>
                updateItem({
                  lineId: item.id,
                  quantity: parseInt(value.target.value),
                })
              }
              className="max-h-[35px] w-[75px]"
            >
              {Array.from([...Array(item.variant.inventory_quantity)].keys())
                .slice(0, 10)
                .map((i) => {
                  const value = i + 1
                  return (
                    <option value={value} key={i}>
                      {value}
                    </option>
                  )
                })}
            </NativeSelect>}
        </div>
        <div className="flex items-end justify-between text-small-regular flex-1">
          <div>
            <button
              className="flex items-center gap-x-1 text-gray-500"
              onClick={async () => {
                const additionalItems = contentfulData
                  ? [
                      ...(contentfulData.freeGifts
                        ? contentfulData.freeGifts
                        : []),
                      ...(contentfulData.addOnProducts
                        ? contentfulData.addOnProducts
                        : []),
                    ]
                  : []
                deleteItem(item.id, item.quantity, additionalItems)
              }}
            >
              <Trash size={14} />
              <span>Remove</span>
            </button>
          </div>
          <div>
            <LineItemPrice
              variant={item.variant as CalculatedVariant}
              quantity={item.quantity}
              region={region}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
