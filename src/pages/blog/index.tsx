import { useState, useEffect } from "react"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { NextPageWithLayout } from "types/global"
import contentfulClient from "@lib/util/contentful-client"
import { AspectRatio, Box, Container, Flex, Grid, GridItem, Heading, Icon, Image, Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import { BsArrowRight } from "react-icons/bs"
import Separator from "@modules/common/icons/separator"

const Store: NextPageWithLayout = () => {
  const [posts, setPosts] = useState<any[]>([])
  useEffect(() => {
    async function getBlogPosts() {
      const entries = await contentfulClient.getEntries({
        content_type: "blogPost",
      })
      if (entries) setPosts([...entries.items].map(item => item.fields))
    }
    getBlogPosts()
  }, [])
  return (
    <>
      <Head title="Store" description="Explore all of our products." />
      <Container maxW='container.xl'>
        <Flex flexDir="column" alignItems="center" mt={12} mb={24}>
          <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
            網誌
          </Heading>
          <Text size="sm" maxW="2xl" m={4} color="gray.500">
            Y&amp;s Recipes 是 香港美容及專欄作家Yoko Tsang 於2014年成立的時尚美容養生館
          </Text>
          <Separator />
        </Flex>
        <Grid templateColumns='repeat(3, 1fr)' gap={6} mt={8} mb={24}>
          {posts.map(post => (<GridItem key={post.slug}>
            <NextLink href={`/blog/${post.slug}`} passHref>
              <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                <Box w="100%">
                  <AspectRatio maxW='400px' ratio={3 / 2}>
                    <Box borderRadius="lg" overflow="hidden">
                      <Image
                        transform="scale(1.0)"
                        src={
                          `https:${post?.image?.fields?.file?.url || ""}`
                        }
                        alt="some text"
                        objectFit="contain"
                        width="100%"
                        transition="0.3s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                      />
                    </Box>
                  </AspectRatio>
                  <Heading fontSize="xl" marginTop={4}>
                    {post.title}
                  </Heading>
                  <Text as="p" fontSize="md" marginTop={4}>
                    {post.caption}
                  </Text>
                  <Flex alignItems="center" mt={4}>
                    <Text color="brand.400">詳細內容</Text>
                    <Icon as={BsArrowRight} color="brand.400" ml={1}/>
                  </Flex>
                </Box>
              </Link>
            </NextLink>
          </GridItem>))}
        </Grid>
      </Container>
    </>
  )
}

Store.getLayout = (page) => <Layout>{page}</Layout>

export default Store
