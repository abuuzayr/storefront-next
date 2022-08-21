import { medusaClient } from "../config"

export const getCollections = async (): Promise<{id: string, handle: string}[]> => {
  const data = await medusaClient.collections
    .list({ limit: 100 })
    .then(({ collections }) => {
      return collections.map(({ id, handle }) => ({ id, handle }))
    })

  return data
}
