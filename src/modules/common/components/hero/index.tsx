import Image from "next/image"
import React from "react"

const Hero = ({ data }: { data: any }) => {
    const fields = data.backgroundImage.fields
    return (
      <div className="h-[90vh] w-full relative">
        <Image
          alt={fields.title}
          style={{ width: "100%", height: "100%" }}
          src={`https:${fields.file.url}`}
          layout="fill"
          loading="eager"
          priority={true}
          quality={90}
          objectFit="cover"
        />
      </div>
    )
}
export default Hero
