import React from "react"
import { Heading, Text, Container, SimpleGrid } from "@chakra-ui/react"
import Tile from "../tile"
import Separator from "../separator"

const TileSection = ({ data }: { data: any }) => {
  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Text size="sm" maxW="2xl" mt={4}>
        {data.subtitle}
      </Text>
      <Separator />
      <SimpleGrid columns={3} spacing={20}>
        {data.tiles?.map((tile: any) => (
          <Tile key={tile.sys.id} id={tile.sys.id} />
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default TileSection
