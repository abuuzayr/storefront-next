import UnderlineLink from "@modules/common/components/underline-link"

const EmptyCartMessage = () => {
  return (
    <div className="bg-white px-8 py-24 flex flex-col justify-center items-center text-center">
      <h1 className="text-2xl-semi">你的購物車暫時是空的</h1>
      <div>
        <UnderlineLink href="/store">探索產品</UnderlineLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
