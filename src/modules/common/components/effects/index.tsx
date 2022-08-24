import React from "react"
import { Heading, Text, Container, Link as ChakraLink, Button, SimpleGrid } from "@chakra-ui/react"
import Effect from "../effect"

const Effects = ({ data }: { data: any }) => {
  const numGrids = Math.ceil(data.effects.length / 3)
  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Text size="sm" maxW="2xl" mt={4}>
        {data.subtitle}
      </Text>
      {[...Array(numGrids)].map((e: any, i: number) => {
        const effects = data.effects.slice(i * 3, i * 3 + 3)
        const cols = effects.length === 3 ? 3 : effects.length
        return (
          <SimpleGrid columns={cols} spacing={20} width="100%" maxW="7xl" key={i} mt={24}>
            {effects.map((effect: any) => (
              <Effect id={effect.sys.id} key={effect.sys.id} />
            ))}
          </SimpleGrid>
        )
      })}
    </Container>
  )
}

export default Effects
