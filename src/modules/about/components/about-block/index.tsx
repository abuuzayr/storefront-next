import React, { ReactNode } from "react"

import { Container, Heading, Box, Text } from "@chakra-ui/react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { INLINES, BLOCKS, MARKS, Document } from "@contentful/rich-text-types"

import Separator from "@modules/common/components/separator"

const AboutBlock = ({ text, isFirstElem }: { text: Document, isFirstElem: boolean }) => {
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: ReactNode) => <b className="font-bold">{text}</b>,
    },
    renderNode: {
      [INLINES.HYPERLINK]: (node: any, children: any) => {
        const { uri } = node.data
        return (
          <a href={uri} className="underline">
            {children}
          </a>
        )
      },
      [BLOCKS.HEADING_1]: (node: any, children: any) => {
        return (
          <Heading as="h1" fontSize={42} m={4}>
            {children}
          </Heading>
        )
      },
      [BLOCKS.HEADING_2]: (node: any, children: any) => {
        return (
          <Heading
            as="h2"
            size="xl"
            textAlign="left"
            color="brand.400"
            my={4}
          >
            {children}
          </Heading>
        )
      },
    },
  }
  return (
    <Container
      maxW="100%"
      bg={isFirstElem ? "brand.400" : "white"}
      centerContent
      my={10}
    >
      <Box maxW={isFirstElem ? "4xl" : "6xl"} p={10} margin="0 auto">
        <Text
          color={isFirstElem ? "white" : "black"}
          textAlign={isFirstElem ? "center" : "left"}
        >
          {documentToReactComponents(text, options)}
        </Text>
        {isFirstElem && <Separator reverse />}
      </Box>
    </Container>
  )
}

export default AboutBlock
