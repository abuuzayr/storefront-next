import React, { ReactNode } from "react"
import { INLINES, BLOCKS, MARKS, Document } from "@contentful/rich-text-types"
import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

type BlogPostProps = {
    data: any
}

const BlogPost: React.FC<BlogPostProps> = ({ data }) => {
    const StandardHeading = ({ c, h }: { c: any, h: any }) => (
        <Heading
            as={h}
            size="lg"
            textAlign="left"
            color="brand.400"
            my={4}
            fontWeight="normal"
        >
            {c}
        </Heading>)
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
            [BLOCKS.HEADING_1]: (node: any, children: any) => <StandardHeading c={children} h="h1" />,
            [BLOCKS.HEADING_2]: (node: any, children: any) => <StandardHeading c={children} h="h2" />,
            [BLOCKS.HEADING_3]: (node: any, children: any) => <StandardHeading c={children} h="h3" />,
            [BLOCKS.HEADING_4]: (node: any, children: any) => <StandardHeading c={children} h="h4" />,
            [BLOCKS.HEADING_5]: (node: any, children: any) => <StandardHeading c={children} h="h5" />,
            [BLOCKS.HEADING_6]: (node: any, children: any) => <StandardHeading c={children} h="h6" />,
            [BLOCKS.PARAGRAPH]: (node: any, children: any) => <Text fontSize="lg">{children}</Text>,
        },
    }
    return (
        <Container maxW="container.md" my={12}>
            <Heading fontWeight="normal" color="gray.500" textAlign="center">{data.title}</Heading>
            <Image
                src={
                    `https:${data?.image?.fields?.file?.url || ""}`
                }
                alt="some text"
                objectFit="contain"
                width="100%"
                my={12}
            />
            <Text fontSize={24} color="gray.500">{data.caption}</Text>
            <Text
                color="gray.500"
            >
                {documentToReactComponents(data.content, options)}
            </Text>
            <Flex color="brand.400" my={12} alignItems="center">
                <Text>標籤：</Text>
                {data.tags.map((tag: string) => <Box key={tag} borderRadius={8} border="1px solid var(--chakra-colors-brand-400)" py={1} px={2} mr={3}>{tag}</Box>)}
            </Flex>
        </Container>
    )
}

export default BlogPost
