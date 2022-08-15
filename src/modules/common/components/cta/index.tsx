import React, { useEffect, useState } from "react"
import { Heading, Text, Container, Link as ChakraLink, Button } from "@chakra-ui/react"
import Separator from "../separator"
import contentfulClient from "@lib/util/contentful-client"
import Link from "next/link"

const CTA = ({ data }: { data: any }) => {
    const [buttonData, setButtonData] = useState<{ [x: string]: any }>()

    useEffect(() => {
      async function getButtonData() {
        const response = await contentfulClient.getEntry(
          data.button.sys.id
        )
        setButtonData(response.fields)
      }
      getButtonData()
    }, [data.button.sys.id])

  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Text size="sm" maxW="2xl" mt={4}>
        {data.subtitle}
      </Text>
      <Separator />
      {buttonData && (
        <Link href={buttonData?.linkTo} passHref>
          <Button
            padding="10px 15px"
            borderStyle="solid"
            borderWidth={1}
            borderColor="brand.400"
            borderRadius={14}
            color="brand.400"
            background="white"
            _hover={{
              textDecoration: "none",
              background: "brand.400",
              color: "white",
            }}
          >
            {buttonData?.title}
          </Button>
        </Link>
      )}
    </Container>
  )
}

export default CTA
