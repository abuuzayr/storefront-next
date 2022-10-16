import clsx from "clsx"
import React, { useState, useEffect } from "react"
import { useHits, UseHitsProps } from "react-instantsearch-hooks-web"
import { ProductHit } from "../hit"
import { medusaClient } from "@lib/config"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
  }

const DesktopHits = ({
  hitComponent: Hit,
  className,
  ...props
}: HitsProps<ProductHit>) => {
  const { hits } = useHits(props)
  const [filteredHits, setFilteredHits] = useState(hits)

  useEffect(() => {
    async function getHitsData() {
      const hitsData = await medusaClient.products
        .list({ limit: 1000 })
        .then(({ products }) => products)
      const hiddenProducts = hitsData.filter(product => product.tags.find(tag => tag.value === 'hidden')).map(p => p.handle)
      setFilteredHits(hits.filter(hit => !hiddenProducts.includes((hit as unknown as ProductHit).handle)))
    }
    getHitsData()
  }, [hits, filteredHits])

  return (
    <div
      className={clsx(
        "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
        className,
        {
          "max-h-[1000px] opacity-100": !!hits.length,
          "max-h-0 opacity-0": !hits.length,
        }
      )}
    >
      <div className="grid grid-cols-1">
        {filteredHits.filter(hit => !(hit as unknown as ProductHit)?.title?.toUpperCase()?.includes('DO NOT USE')).map((hit, index) => (
          <li key={index} className="list-none">
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
    </div>
  )
}

export default DesktopHits
