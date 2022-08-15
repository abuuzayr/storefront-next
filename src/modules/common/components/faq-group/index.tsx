import React, { useEffect, useState } from "react"
import {
  Container,
  Heading, 
  Box, 
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import contentfulClient from "@lib/util/contentful-client"

const Faq = ({ id }: { id: string }) => {
  const [data, setData] = useState<any>()
  useEffect(() => {
    async function getFaq() {
      const response = await contentfulClient.getEntry(id)
      setData(response.fields)
    }
    getFaq()
  }, [id])
  return (
    <AccordionItem border="none">
      {data && (
        <>
          <h2>
            <AccordionButton borderBottom="1px solid #616161" py={5} px={4}>
              <Box flex="1" textAlign="left">
                {data.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel py={5} px={4}>
            {data.answer}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

const FaqGroup = ({ data }: { data: any }) => {
  return (
    <Container maxW="100%" centerContent my={10}>
      <Container maxW="4xl" my={10}>
        <Heading as="h1" size="lg">
          {data.title}
        </Heading>
        <Accordion my={10} allowToggle>
          {data.faqs.map((faq: any) => (
            <Faq key={faq.sys.id} id={faq.sys.id} />
          ))}
        </Accordion>
      </Container>
    </Container>
  )
}

export default FaqGroup
