import React from "react"
import { Container } from "@chakra-ui/react"
import SeparatorSVG from "@modules/common/icons/separator"
import WhiteSeparatorSVG from "@modules/common/icons/separator-white"

const Separator = ({ reverse }: { reverse?: boolean }) => {
  return (
    <Container maxW="full" centerContent my={6}>
      {reverse ? <WhiteSeparatorSVG /> : <SeparatorSVG />}
    </Container>
  )
}

export default Separator
