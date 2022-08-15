import React from "react"
import {
  Heading,
  Text,
  Container,
  Link,
  SimpleGrid,
  Box,
  Stack,
} from "@chakra-ui/react"

const Location = ({ data }: { data: any }) => {
  return (
    <Container my={10} maxW="7xl">
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Box>
            <Heading
              as="h2"
              size="xl"
              color="brand.400"
              marginBottom="lg"
            >
              {data.name}
            </Heading>
            <div style={{ height: "0.5rem" }} />
            <Text fontSize="lg">{data.address}</Text>
          </Box>
          <div style={{ height: "1rem" }} />
          <Link
            href={data.googleMapsLink}
            isExternal
            padding="10px 15px"
            border="1px solid var(--chakra-colors-brand-400)"
            borderRadius={14}
            color="brand.400"
            cursor="pointer"
            _hover={{
              textDecoration: "none",
              background: "var(--chakra-colors-brand-400)",
              color: "white",
            }}
            style={{
              margin: "1rem 0",
            }}
          >
            打開 Google地圖
          </Link>
          <div style={{ height: "3rem" }} />
          <Stack direction="column" spacing={8} mt="4xl">
            <Box>
              <Heading as="h6" size="md" color="brand.400">
                電話
              </Heading>
              <Text>{data.phoneNumber}</Text>
            </Box>
            <Box>
              <Heading as="h6" size="md" color="brand.400">
                營業時間
              </Heading>
              <Text>{data.openingHours}</Text>
            </Box>
            <Box>
              <Heading as="h6" size="md" color="brand.400">
                接受付款方式
              </Heading>
              <Text mt="lg">{data.paymentMethods.paymentMethods}</Text>
            </Box>
          </Stack>
        </Box>
        <div>
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${data.location.lat},${data.location.lon}&zoom=18&q=${data.address}`}
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen={false}
            aria-hidden="false"
            tabIndex={0}
          ></iframe>
        </div>
      </SimpleGrid>
    </Container>
  )
}

export default Location
