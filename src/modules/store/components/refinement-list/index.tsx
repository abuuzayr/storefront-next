import { StoreGetProductsParams } from "@medusajs/medusa"
import { useCollections } from "medusa-react"
import { ChangeEvent } from "react"

type RefinementListProps = {
  title?: string
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const RefinementList = ({
  title,
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const { collections, isLoading } = useCollections()

  const handleCollectionChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { checked } = e.target

    const collectionIds = refinementList.collection_id || []

    const exists = collectionIds.includes(id)

    if (checked && !exists) {
      setRefinementList({
        ...refinementList,
        collection_id: [...collectionIds, id],
      })

      return
    }

    if (!checked && exists) {
      setRefinementList({
        ...refinementList,
        collection_id: collectionIds.filter((c) => c !== id),
      })

      return
    }

    return
  }

  return (
    <div>
      <div className="py-8">
        <h1
          style={{ color: "var(--chakra-colors-brand-400)" }}
          className="text-xl-regular mb-3"
        >
          {title ? title : "店鋪"}
        </h1>
          <div className="text-gray-500 flex flex-wrap gap-4 gap-y-1">
            {collections?.map((c) => (
              <div key={c.id}>
                <label className="cursor-pointer" style={{ color: refinementList.collection_id?.includes(
                      c.id
                    ) ? "var(--chakra-colors-brand-400)" : "#6b7280" }}>
                  <input
                    type="checkbox"
                    defaultChecked={refinementList.collection_id?.includes(
                      c.id
                    )}
                    onChange={(e) => handleCollectionChange(e, c.id)}
                    className="accent-amber-200 hidden"
                  />
                  {c.title}
                </label>
              </div>
            ))}
          </div>
      </div>
    </div>
  )
}

export default RefinementList
