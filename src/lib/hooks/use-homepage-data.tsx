import { useQuery } from "react-query"
import { fetchGraphQL } from "@lib/contentful/api"

const homeQuery = `
  query HomeQuery {
    page: pageCollection(where: {title: "Home"}, limit: 1) {
      items {
        title
        metaDescription
        contentModulesCollection(limit: 20) {
          items {
            ... on ContentTypeRichText {
              __typename
              text {
                json
              }
            }
            ... on Video {
              __typename
              title
              youTubeUrl
              coverImage {
                url
              }
            }
            ... on TileSection {
              title
              subtitle
              tilesCollection(limit: 20) {
                items {
                  ... on Tile {
                    title
                    subtitle
                    image {
                      url
                    }
                  }
                }
              }
            }
            ... on TabbedProducts {
              __typename
              subtitle
              title
              collections
            }
            ... on ImageSlider {
              __typename
              title
              subtitle
              imagesCollection {
                items {
                  title
                  url
                }
              }
            }
            ... on Hero {
              __typename
              backgroundImage {
                url
                title
              }
            }
            ... on Cta {
              title
              subtitle
              button {
                linkTo
                title
              }
            }
            ... on ContentTypeLocation {
              __typename
              address
              googleMapsLink
              name
              phoneNumber
              openingHours
              paymentMethods
              location {
                lat
                lon
              }
            }
            ... on FaqGroup {
              __typename
              title
              faqsCollection {
                items {
                  question
                  answer
                }
              }
            }
          }
        }
      }
    }
    products: productCollection(limit: 100) {
      items {
        medusaId
        title
        collection
        handle
        thumbnail {
          url
        }
        description
        variantsCollection(limit: 10) {
          items {
            title
            medusaId
            prices
            options
          }
        }
      }
    }
  }
`

const fetchHomeData = async () => {
  return await fetchGraphQL(homeQuery)
}

export const useHomeData = () => {
  const data = useQuery("home_data", fetchHomeData, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return data
}