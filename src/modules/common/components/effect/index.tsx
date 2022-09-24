import React, { useEffect, useState } from "react"
import { Heading, Stack, Text } from "@chakra-ui/react"
import contentfulClient from "@lib/util/contentful-client"
import Image from "next/image"

const Effect = ({ id }: { id: string }) => {
  const [effect, setEffect] = useState<{ [x: string]: any }>()

  useEffect(() => {
    async function getEffect() {
      const response = await contentfulClient.getEntry(id)
      console.log(response.fields)
      setEffect(response.fields)
    }
    getEffect()
  }, [id])

  return (
    <>
      {effect && (
        <Stack>
          <Image
            alt={effect.image?.fields?.title || ""}
            src={`https:${effect.image?.fields?.file.url || ""}`}
            height={120}
            width={120}
          />
          <Heading as="h3" fontSize={21} color="brand.400" fontWeight="400">
            {effect.title}
          </Heading>
          <Text size="sm" maxW="2xl" mt={4}>
            {effect.subtitle}
          </Text>
        </Stack>
      )}
    </>
  )
}

export default Effect
