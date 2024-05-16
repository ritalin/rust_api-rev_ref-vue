import { defineStore } from 'pinia'
import type { ConnectionProvider, ConnectionWrapper } from '@/service/core'
import { createSchemaCore, ingestCore, type IngestionQuery } from './dao'

export type IngestOption = 'NeedTruncate' | 'None'

export const useConnectorStore = defineStore('connector', () => {
  let db: ConnectionProvider

  const ingestAsync = async (provider: ConnectionProvider, namespace: string) => {
    db = provider
      
    const conn = await db.connect()
    try {
      await createSchemaCore(conn)
      await ingestCore(conn, namespace)
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      conn.close()
    }
  }

  const initOnly = async (provider: ConnectionProvider) => {
    db = provider
  }

  const connectAsync = (): Promise<ConnectionWrapper> => {
    return db!.connect()
  }

  return { ingestAsync, connectAsync, initOnly }
})
