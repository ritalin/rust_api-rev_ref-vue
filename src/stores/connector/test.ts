import { expect, describe, beforeAll, beforeEach, it, test } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { initDb } from "@/service/database"
import { useConnectorStore } from "."

import { ingestionQuery } from '@/test-support/initial-data'

describe('Connect database', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it ("Init blocking database", async () => {
        const provider = await initDb()
        expect(provider).to.not.be.null

        const connectorStore = useConnectorStore()

        await connectorStore.ingestAsync(provider, ingestionQuery)

        const conn = await connectorStore.connectAsync()
        try {
            // await conn.runQuery(`COPY prototype FROM 'src/assets/test-fixture/resources/prototype.json' (FORMAT 'json', array 'true')`)

            {
                const results = await conn.runQuery("select * from prototype")
                expect(results.toArray()).to.be.not.lengthOf(0)
            }

            {
                const results = await conn.runQuery("select * from type_symbol")
                expect(results.toArray()).to.be.not.lengthOf(0)
            }

            {
                const results = await conn.runQuery("select * from crate_symbol")
                expect(results.toArray()).to.be.not.lengthOf(0)
            }
        }
        finally {
            await conn.close()
        }    
    })
})