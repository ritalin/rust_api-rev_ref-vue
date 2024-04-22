import { defineStore } from 'pinia'
import type { ConnectionProvider, ConnectionWrapper } from '@/service/core'
import { createSchemaCore, truncateCore, ingestCore } from './dao'

export type IngestOption = 'NeedTruncate' | 'None'

export const useConnectorStore = defineStore('connector', () => {
  let db: ConnectionProvider

  const ingest = async (provider: ConnectionProvider, namespace: string, option: IngestOption = 'NeedTruncate') => {
      db = provider
        
      const conn = await db.connect()

      await createSchemaCore(conn)

      if (option === 'NeedTruncate') {
        await truncateCore(conn)
    }

    await ingestCore(conn, namespace)
}

  const connect = (): Promise<ConnectionWrapper> => {
    return db.connect()
  }

  return { ingest, connect }
})
