import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { CartDropdownProvider } from "@lib/context/cart-dropdown-context"
import { WishlistDropdownProvider } from "@lib/context/wishlist-dropdown-context"
import { MobileMenuProvider } from "@lib/context/mobile-menu-context"
import { StoreProvider } from "@lib/context/store-context"
import { CartProvider, MedusaProvider } from "medusa-react"
import { Hydrate } from "react-query"
import "styles/globals.css"
import { AppPropsWithLayout } from "types/global"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { WishlistProvider } from "@lib/context/wishlist-context"

const customTheme = {
  colors: {
    brand: {
      400: "#E02784",
    },
  },
  fonts: {
    heading: `Inter, sans-serif`,
    body: `Inter, sans-serif`,
  },
  components: {
    Text: {
      baseStyle: {
        fontSize: 14,
      },
    },
    Button: {
      baseStyle: {
        fontSize: 14,
        fontWeight: 400,
      },
    },
  },
}

const theme = extendTheme(customTheme)

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <Hydrate state={pageProps.dehydratedState}>
        <CartDropdownProvider>
          <WishlistDropdownProvider>
            <MobileMenuProvider>
              <CartProvider>
                <WishlistProvider>
                  <StoreProvider>
                    <AccountProvider>
                      <ChakraProvider theme={theme}>
                        {getLayout(<Component {...pageProps} />)}
                      </ChakraProvider>
                    </AccountProvider>
                  </StoreProvider>
                </WishlistProvider>
              </CartProvider>
            </MobileMenuProvider>
          </WishlistDropdownProvider>
        </CartDropdownProvider>
      </Hydrate>
    </MedusaProvider>
  )
}

export default App
