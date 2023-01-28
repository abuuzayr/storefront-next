import React from "react"
import Image from "next/image"
import { Heading, Text, Container } from "@chakra-ui/react"
import Separator from "../separator"
import 'react-multi-carousel/lib/styles.css'
import Carousel from "react-multi-carousel"
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"

const ImageSlider = ({ data }: { data: any }) => {
  const arrowStyles = {
    position: "absolute" as "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    width: 30,
    height: 30,
    cursor: "pointer",
  }
  const settings = {
    showIndicators: false,
    showThumbs: false,
    showStatus: false,
    renderArrowPrev: (onClickHandler: any, hasPrev: any, label: any) => (
      <FaArrowCircleLeft
        onClick={onClickHandler}
        style={{ ...arrowStyles, left: -50 }}
        color={hasPrev ? "var(--chakra-colors-brand-400)" : "gray"}
      />
    ),
    renderArrowNext: (onClickHandler: any, hasNext: any, label: any) => (
      <FaArrowCircleRight
        onClick={onClickHandler}
        style={{ ...arrowStyles, right: -50 }}
        color={hasNext ? "var(--chakra-colors-brand-400)" : "gray"}
      />
    ),
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl" overflow="hidden">
      <Heading as="h3" fontSize={42} color="brand.400" fontWeight="400">
        {data.title}
      </Heading>
      <Text size="sm" maxW="2xl" mt={4}>
        {data.subtitle}
      </Text>
      <Separator />
      <div style={{ height: "3rem" }} />
      <Carousel responsive={responsive}>
        {data.images.map((img: any) => (
          <div key={img.sys.id} style={{ position: "relative" }}>
            <Image
              alt={img?.fields?.title}
              width={img?.fields?.file?.details?.image?.width}
              height={img?.fields?.file?.details?.image?.height}
              src={`https:${img?.fields?.file?.url}`}
              loading="eager"
              priority={true}
              quality={90}
              objectFit="cover"
            />
          </div>
        ))}
      </Carousel>
    </Container>
  )
}

export default ImageSlider
