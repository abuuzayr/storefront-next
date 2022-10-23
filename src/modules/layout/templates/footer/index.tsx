import React, { useEffect, useState } from "react"
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react"
import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa"
import Image from "next/image"
import contentfulClient from "@lib/util/contentful-client"

const logos = [
  "ae.png",
  "alipay.png",
  "fps.png",
  "mastercard.png",
  "payme.png",
  "paypal.png",
  "unionpay.png",
  "visa.png",
  "wechat.png",
]

const ListHeader = ({ children }: { children: any }) => {
  return (
    <Text mb={2} color="brand.400">
      {children}
    </Text>
  )
}

const List = ({ id }: { id: string }) => {
  const [menu, setMenu] = useState<any>()
  useEffect(() => {
    async function getMenu() {
      const response = await contentfulClient.getEntry(id)
      setMenu(response.fields)
    }
    getMenu()
  }, [id])
  if (!menu) return <></>
  return (
    <>
      <ListHeader>{menu.title}</ListHeader>
      {menu.items && menu.items.length && menu.items.map((item: any) => (
        <MenuItem id={item.sys.id} key={item.sys.id} />
      ))}
    </>
  )
}

const MenuItem = ({ id }: { id: string }) => {
  const [link, setLink] = useState<any>()
  useEffect(() => {
    async function getLink() {
      const response = await contentfulClient.getEntry(id)
      setLink(response.fields)
    }
    getLink()
  }, [id])
  if (!link) return <></>
  return (
    <Link href={link.link.fields.linkTo} key={id}>
      {link.title}
    </Link>
  )
}

export default function Footer() {
  const [data, setData] = useState<Array<any>>([])

  useEffect(() => {
    async function getData() {
      const response = await contentfulClient.getEntries({
        content_type: "navigationArea",
        limit: 1,
        "fields.name": "Footer",
      })
      setData(response.items[0].fields.references)
    }
    getData()
  }, [])

  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      overflow="hidden"
    >
      <Box
        borderTopWidth={1}
        borderBottomWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <SimpleGrid
          columns={[5,5,9]}
          spacing={[1,2,8]}
          maxW={"8xl"}
          px={4}
          py={8}
          m="0 auto"
        >
          {logos.map((path) => (
            <Image
              src={`/payment-logos/${path}`}
              key={path}
              alt={`${path} logo`}
              width={56}
              height={56}
              layout="fixed"
            />
          ))}
        </SimpleGrid>
      </Box>
      <Container as={Stack} maxW={"8xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={8}>
          {data.map((area: any) => (
            <Stack align={["center", "center", "flex-start"]} key={area.sys.id}>
              {area.fields.references.map((menu: any) => (
                <List key={menu.sys.id} id={menu.sys.id} />
              ))}
            </Stack>
          ))}
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <SimpleGrid
          columns={[1, 1, 3]}
          spacing={8}
          maxW={"8xl"}
          px={4}
          py={8}
          m="0 auto"
        >
          <Text align={["center", "center", "left"]}>
            Copyright © 2014 - {new Date().getFullYear()}, Y&apos;s Recipes. All
            Rights Reserved.
          </Text>
          <Stack direction={"row"} spacing={6} m="0 auto">
            <Link href={"#"}>私隱政策</Link>
            <Link href={"#"}>條款及細則</Link>
            <Link href={"#"}>網站地圖</Link>
          </Stack>
          <Stack direction={"row"} spacing={6} justifySelf={["center", "center", "flex-end"]}>
            <FaFacebook color="var(--chakra-colors-brand-400)" size={24} />
            <FaInstagram color="var(--chakra-colors-brand-400)" size={24} />
            <FaYoutube color="var(--chakra-colors-brand-400)" size={24} />
          </Stack>
        </SimpleGrid>
      </Box>
    </Box>
  )
}
