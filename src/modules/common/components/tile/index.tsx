import React, { useEffect, useState } from "react"
import { GridItem, Heading, Text } from "@chakra-ui/react"
import contentfulClient from "@lib/util/contentful-client"
import Image from "next/image"

const Tile = ({ id }: { id: string }) => {
    const [data, setData] = useState<{[x: string]: any}>()

    useEffect(() => {
        async function getData() {
            const response = await contentfulClient.getEntry(id)
            setData(response.fields)
            console.log(response.fields)
        }
        getData()
    }, [id])

  return (
    <>
      {data && (
        <GridItem>
          <Image
            alt={data.image.fields.title}
            src={`https:${data.image.fields.file.url}`}
            height={384}
            width={384}
          />
          <Heading
            as="h3"
            fontSize={21}
            color="brand.400"
            fontWeight="400"
          >
            {data.title}
          </Heading>
          <Text size="sm" maxW="2xl" mt={4}>
            {data.subtitle}
          </Text>
        </GridItem>
      )}
    </>
  )
}

export default Tile
