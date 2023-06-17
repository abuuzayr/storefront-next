import { useMobileMenu } from "@lib/context/mobile-menu-context"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import WishlistDropdown from "@modules/layout/components/wishlist-dropdown"
import MobileMenu from "@modules/mobile-menu/templates"
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal"
import clsx from "clsx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useNavbarData } from "@lib/hooks/use-layout-data"
import { BiChevronDown, BiMenu } from "react-icons/bi"
import {
  Text,
  Heading,
  Grid,
  GridItem,
  Button,
  Box,
  Container,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import Image from "next/image"
import contentfulClient from "@lib/util/contentful-client"

const ResolvedLink = ({ id }: { id: string }) => {
  const [linkData, setLinkData] = useState<{ [x: string]: any }>({})

  useEffect(() => {
    async function getLinkData() {
      const response = await contentfulClient.getEntry(
        id
      )
      setLinkData(response.fields)
    }
    getLinkData()
  }, [id])

  return (
    <Link href={linkData?.link?.fields.linkTo} display="block">{linkData?.title}</Link>
  )
}

const Nav = () => {
  const { pathname } = useRouter()
  const [isHome, setIsHome] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data, isLoading } = useNavbarData()

  let bannerData, leftNavData, rightNavData

  if (data && !isLoading) {
    leftNavData = data?.[0].items[0].fields.references
    rightNavData = data?.[1].items[0].fields.references
    bannerData = data?.[2].items[0].fields
  }
  

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
      <Box display={["block", "block", "none"]} py={3}>
        <Text align="center" size="xs">
          {bannerData ? bannerData.text : ""}
        </Text>
      </Box>
      <Container style={{ boxShadow: "0px 1px 0px 0px #E0E0E0" }} maxW="full">
        <Container maxW="container.xl" py={2}>
          <Grid
            templateColumns={["1fr 1fr", "1fr 1fr", "1fr 3fr 1fr"]}
            gap={6}
            alignItems="center"
            justifyContent="end"
          >
            <GridItem>
              <Link href="/" _hover={{ textDecoration: "none" }}>
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
            <GridItem display={["none", "none", "block"]}>
              <Text align="center" size="xs">
                {bannerData ? bannerData.text : ""}
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
                  <DesktopSearchModal />
                </GridItem>
                <GridItem>
                  <WishlistDropdown />
                </GridItem>
                <GridItem>
                  <CartDropdown />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Container>
      </Container>
      <Accordion display={["block", "block", "none"]} allowToggle w="full">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" px={4}>
                <BiMenu size={24} />
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Accordion allowToggle>
              {[...(leftNavData ? leftNavData : []), ...(rightNavData ? rightNavData : [])].map((nav: any) => (
                <AccordionItem key={nav.sys.id}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {nav?.fields?.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {nav?.fields?.items?.map((item: any) => (
                      <ResolvedLink key={item.sys.id} id={item.sys.id} />
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Container
        maxW="container.xl"
        py={8}
        centerContent
        display={["none", "none", "block"]}
      >
        <Grid
          templateColumns="2fr 1fr 2fr"
          gap={6}
          alignItems="center"
          width="100%"
        >
          <GridItem>
            {leftNavData && (
              <Grid
                templateColumns={`repeat(${leftNavData.length}, 1fr)`}
                gap={4}
                alignItems="center"
              >
                {leftNavData.map((nav: any) => {
                  if (!nav) return null
                  return (
                    <GridItem textAlign="center" key={nav.sys.id}>
                      <>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rounded={"full"}
                            variant={"link"}
                            cursor={"pointer"}
                            minW={0}
                            _hover={{ textDecoration: "none" }}
                          >
                            {nav?.fields?.title}
                            <BiChevronDown
                              color="var(--chakra-colors-brand-400)"
                              style={{ display: "inline" }}
                            />
                          </MenuButton>
                          <MenuList>
                            {nav?.fields?.items?.map((item: any) => (
                              <MenuItem key={item.sys.id}>
                                <ResolvedLink id={item.sys.id} />
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </>
                    </GridItem>
                  )
                })}
              </Grid>
            )}
          </GridItem>
          <GridItem m="0 auto">
            <Image
              src="/logo.jpeg"
              alt="Y's Recipes logo"
              width="166"
              height="128"
            />
          </GridItem>
          {rightNavData && (
            <Grid
              templateColumns={`repeat(${rightNavData.length}, 1fr)`}
              gap={4}
              alignItems="center"
            >
              {rightNavData.map((nav: any) => (
                <GridItem textAlign="center" key={nav.sys.id}>
                  <>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rounded={"full"}
                        variant={"link"}
                        cursor={"pointer"}
                        minW={0}
                        _hover={{ textDecoration: "none" }}
                      >
                        {nav?.fields?.title}
                        <BiChevronDown
                          color="var(--chakra-colors-brand-400)"
                          style={{ display: "inline" }}
                        />
                      </MenuButton>
                      <MenuList>
                        {nav?.fields?.items?.map((item: any) => (
                          <MenuItem key={item.sys.id}>
                            <ResolvedLink id={item.sys.id} />
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </>
                </GridItem>
              ))}
            </Grid>
          )}
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
            <div className="hidden small:block h-full"></div>
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
