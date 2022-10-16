import { Heading } from "@chakra-ui/react"
import { CheckoutProvider } from "@lib/context/checkout-context"
import ChevronDown from "@modules/common/icons/chevron-down"
import Link from "next/link"
import CheckoutLoader from "../components/checkout-loader"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"

const CheckoutTemplate = () => {
  return (
    <CheckoutProvider>
      <div className="bg-gray-100 relative small:min-h-screen">
        <div className="h-16 bg-white">
          <nav className="flex items-center h-full justify-between content-container">
            <Link href="/cart">
              <a className="text-small-semi text-gray-700 flex items-center gap-x-2 uppercase flex-1 basis-0">
                <ChevronDown className="rotate-90" size={16} />
                <span className="mt-px">返回網店</span>
              </a>
            </Link>
            <Link href="/" passHref>
              <Heading
                as="h2"
                size="lg"
                noOfLines={1}
                color="brand.400"
                style={{
                  fontFamily: `'IM Fell Double Pica', sans-serif`,
                }}
              >
                Y&apos;s Recipes
              </Heading>
            </Link>
            <div className="flex-1 basis-0" />
          </nav>
        </div>
        <div className="relative">
          <CheckoutLoader />
          <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] gap-y-8 content-container gap-x-8 py-3 px-3 md:py-12">
            <CheckoutForm />
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
