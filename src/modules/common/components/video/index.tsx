import React, { useState } from "react"
import { Container, Icon } from "@chakra-ui/react"
import YouTube from "react-youtube"
import { FaPlayCircle } from "react-icons/fa"
import Image from "next/image"

const Video = ({ data }: { data: any }) => {
  const [showThumbnail, setShowThumbnail] = useState(true)
  const _onReady = (event: any) => {
    event.target.playVideo()
  }
  console.log(data)
  return (
    <Container centerContent textAlign="center" my={10} maxW="8xl">
      {showThumbnail ? (
        <Container maxW="8xl" style={{ position: "relative" }}>
          <Image
            alt={data.coverImage?.fields?.title || ""}
            style={{ width: "100%", height: "100%" }}
            src={`https:${data.coverImage?.fields?.file?.url} || ""`}
            width={data.coverImage?.fields?.file?.details?.image?.width || 0}
            height={data.coverImage?.fields?.file?.details?.image?.height || 0}
            loading="eager"
            priority={true}
            quality={90}
            objectFit="cover"
          />
          <Icon
            as={FaPlayCircle}
            w={16}
            h={16}
            color="white"
            onClick={() => setShowThumbnail(false)}
            style={{
              position: "absolute",
              top: "calc(50% - 2rem)",
              left: "calc(50% - 2rem)",
            }}
            _hover={{
              color: "gray.300",
              cursor: "pointer",
            }}
          />
        </Container>
      ) : (
        <YouTube
          videoId={data.youTubeUrl.split("?v=")[1]}
          onReady={_onReady}
          className="youtubeContainer"
        />
      )}
    </Container>
  )
}

export default Video
