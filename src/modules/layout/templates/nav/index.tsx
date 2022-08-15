import { useMobileMenu } from "@lib/context/mobile-menu-context"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import MobileMenu from "@modules/mobile-menu/templates"
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useNavbarData } from "@lib/hooks/use-layout-data"
import { BiSearch, BiHeart, BiChevronDown } from "react-icons/bi"
import {
  Text,
  Heading,
  Grid,
  GridItem,
  Button,
  Box,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react"
import Image from "next/image"

const Nav = () => {
  const { pathname } = useRouter()
  const [isHome, setIsHome] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: data, isLoading: loadingData } = useNavbarData()

  //useEffect that detects if window is scrolled > 5px on the Y axis
  useEffect(() => {
    if (isHome) {
      const detectScrollY = () => {
        if (window.scrollY > 5) {
          setIsScrolled(true)
        } else {
          setIsScrolled(false)
        }
      }

      window.addEventListener("scroll", detectScrollY)

      return () => {
        window.removeEventListener("scroll", detectScrollY)
      }
    }
  }, [isHome])

  useEffect(() => {
    pathname === "/" ? setIsHome(true) : setIsHome(false)
  }, [pathname])

  const { toggle } = useMobileMenu()

  return (
    <Box>
      <Container style={{ boxShadow: "0px 1px 0px 0px #E0E0E0" }} maxW="full">
        <Container maxW="container.xl" py={2}>
          <Grid
            templateColumns="1fr 3fr 1fr"
            gap={6}
            alignItems="center"
            justifyContent="end"
          >
            <GridItem>
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
            </GridItem>
            <GridItem>
              <Text align="center" size="xs">
                {data ? data.data.banner.items[0].text : ""}
              </Text>
            </GridItem>
            <GridItem>
              <Grid
                templateColumns="repeat(3, 50px)"
                gap={2}
                alignItems="center"
                justifyContent="end"
              >
                <GridItem>
                  <Button variant="ghost" colorScheme="white">
                    <BiSearch
                      size={24}
                      style={{ color: "var(--chakra-colors-brand-400)" }}
                    />
                  </Button>
                </GridItem>
                <GridItem>
                  <Button variant="ghost" colorScheme="white">
                    <BiHeart
                      size={24}
                      style={{ color: "var(--chakra-colors-brand-400)" }}
                    />
                  </Button>
                </GridItem>
                <GridItem>
                  <CartDropdown />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Container>
      </Container>
      <Container maxW="container.xl" py={8} centerContent>
        <Grid
          templateColumns="2fr 1fr 2fr"
          gap={6}
          alignItems="center"
          width="100%"
        >
          <GridItem>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center">
              <GridItem textAlign="center">
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      限時優惠{" "}
                      <BiChevronDown
                        color="var(--chakra-colors-brand-400)"
                        style={{ display: "inline" }}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem>Link 3</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              </GridItem>
              <GridItem textAlign="center">
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      網誌{" "}
                      <BiChevronDown
                        color="var(--chakra-colors-brand-400)"
                        style={{ display: "inline" }}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem>Link 3</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              </GridItem>
              <GridItem textAlign="center">
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      護膚產品{" "}
                      <BiChevronDown
                        color="var(--chakra-colors-brand-400)"
                        style={{ display: "inline" }}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem>Link 3</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem m="0 auto">
            <Image
              src="/logo.png"
              alt="Y's Recipes logo"
              width="166"
              height="128"
            />
          </GridItem>
          <GridItem>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center">
              <GridItem textAlign="center">
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      養生食材{" "}
                      <BiChevronDown
                        color="var(--chakra-colors-brand-400)"
                        style={{ display: "inline" }}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem>Link 3</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              </GridItem>
              <GridItem textAlign="center">
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      保健食品{" "}
                      <BiChevronDown
                        color="var(--chakra-colors-brand-400)"
                        style={{ display: "inline" }}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem>Link 3</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              </GridItem>
              <GridItem textAlign="center">
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      關於我們{" "}
                      <BiChevronDown
                        color="var(--chakra-colors-brand-400)"
                        style={{ display: "inline" }}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem>Link 3</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )

  return (
    <div
      className={clsx("sticky top-0 inset-x-0 z-50 group", {
        "!fixed": isHome,
      })}
    >
      <header
        className={clsx(
          "relative h-16 px-8 mx-auto transition-colors bg-transparent border-b border-transparent duration-200 group-hover:bg-white group-hover:border-gray-200",
          {
            "!bg-white !border-gray-200": !isHome || isScrolled,
          }
        )}
      >
        <nav
          className={clsx(
            "text-gray-900 flex items-center justify-between w-full h-full text-small-regular transition-colors duration-200",
            {
              "text-white group-hover:text-gray-900": isHome && !isScrolled,
            }
          )}
        >
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="block small:hidden">
              <Hamburger setOpen={toggle} />
            </div>
            <div className="hidden small:block h-full">
            </div>
          </div>

          <div className="flex items-center h-full">
            <Link href="/">
              <a className="text-xl-semi uppercase">Acme</a>
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && <DesktopSearchModal />}
              <Link href="/account">
                <a>Account</a>
              </Link>
            </div>
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
      </header>
    </div>
  )
}

export default Nav
