import { expect, describe, beforeAll, beforeEach, it, test } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { initDb } from "@/service/database"
import { useConnectorStore } from "."

describe('Connect database', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it ("Init blocking database", async () => {
        const provider = await initDb()
        expect(provider).to.not.be.null

        const connectorStore = useConnectorStore()

        await connectorStore.ingestAsync(provider, 'src/assets/fixture/connector')

        const conn = await connectorStore.connectAsync()
        try {
            {
                const results = await conn.runQuery("select * from prototype")
                expect(results.toArray()).to.be.lengthOf(2)
            }

            {
                const results = await conn.runQuery("select * from type_symbol")
                expect(results.toArray()).to.be.lengthOf(3)
            }

            {
                const results = await conn.runQuery("select * from type_ref")
                expect(results.toArray()).to.be.lengthOf(4)
            }
        }
        finally {
            await conn.close()
        }    
    })
})