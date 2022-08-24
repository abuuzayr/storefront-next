import React, { useEffect, useState } from "react"
import {
  Heading,
  Text,
  Container,
  Grid,
  GridItem,
  Flex,
  HStack,
  Stack,
  Center,
} from "@chakra-ui/react"
import Separator from "../separator"
import Image from "next/image"
import contentfulClient from "@lib/util/contentful-client"

const Instructions = ({ data }: { data: any }) => {
  const [instructions, setInstructions] = useState<Array<any>>([])

  useEffect(() => {
    async function getInstructions() {
      const response = await contentfulClient.getEntries({
        content_type: "tile",
        "sys.id[in]": data.instructions
          .map((ingredient: any) => ingredient.sys.id)
          .join(","),
      })
      setInstructions(response.items)
    }
    if (data.instructions.length) getInstructions()
  }, [data.instructions])

  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Text size="sm" maxW="2xl" mt={4}>
        {data.subtitle}
      </Text>
      <Separator />
      {instructions.map((i: any) => (
        <Flex key={i.sys.id} justifyContent="start" alignItems="center" maxW="xl" mt={10}>
          <Image
            alt={i.fields.image.fields.title}
            src={`https:${i.fields.image.fields.file.url}`}
            height={128}
            width={128}
          />
          <Stack width="100%" ml={12}>
            <Text color="brand.400" textAlign="left" size="xl">
              {i.fields.title}
            </Text>
            <Text textAlign="left" size="md">
              {i.fields.subtitle}
            </Text>
          </Stack>
        </Flex>
      ))}
    </Container>
  )
}

export default Instructions
