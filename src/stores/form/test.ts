import { initDb } from '@/service/database'
import { setActivePinia, createPinia } from 'pinia'
import { expect, describe, beforeAll, beforeEach, it, test } from 'vitest'
import { useConnectorStore } from '../connector'
import type { ConnectionProvider } from '@/service/core'
import { useSearchFormStore } from '.'
import { useSearchResultStore } from '../search-result'

describe('Connect database', () => {
    let provider: ConnectionProvider

    beforeAll(async () => {
        provider = await initDb()
    })
    beforeEach(() => {
        setActivePinia(createPinia())

        const connectorStore = useConnectorStore()
        connectorStore.ingestAsync(provider, 'src/assets/fixture/search-result')
    })

    it ("Empty arg and return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setArgsAsync("")
        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)

        await formStore.setReturnAsync("")
        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setArgsAsync("")
        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
    })

    it ("Search arg type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setArgsAsync("i32")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(2)

        expect(resultStore.items[0].args).to.be.include("i32")
        expect(resultStore.items[1].args).to.be.include("i32")
    })

    it ("Search return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setReturnAsync("Result")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(5)

        expect(resultStore.items[0].returns).to.be.equal("Result")
        expect(resultStore.items[1].returns).to.be.equal("Result")
        expect(resultStore.items[2].returns).to.be.equal("Result")
        expect(resultStore.items[3].returns).to.be.equal("Result")
        expect(resultStore.items[4].returns).to.be.equal("Result")
    })

    it ("Search args and return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setReturnAsync("Result")
        await formStore.setArgsAsync("Duration")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(2)

        expect(resultStore.items[0].returns).to.be.equal("Result")
        expect(resultStore.items[1].returns).to.be.equal("Result")

        expect(resultStore.items[0].args).to.be.include("Duration")
        expect(resultStore.items[1].args).to.be.include("Duration")
    })

    it ("Search args type, then search empty", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setArgsAsync("i32")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(2)
        
        await formStore.setArgsAsync("")
        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
    })

    it ("Search return type, then search empty", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setReturnAsync("Result")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(5)
        
        await formStore.setReturnAsync("")
        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
    })

    it ("Search args and return type, then be empty args type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setReturnAsync("Result")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(5)

        await formStore.setArgsAsync("Duration")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(2)
        
        await formStore.setArgsAsync("")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(5)
    })

    it ("Search args and return type, then be empty return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)

        await formStore.setArgsAsync("i32")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(2)
        
        await formStore.setReturnAsync("f64")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(1)
        
        await formStore.setReturnAsync("")
        expect(resultStore.searching).to.be.true
        expect(resultStore.items).to.be.lengthOf(2)
    })
})
