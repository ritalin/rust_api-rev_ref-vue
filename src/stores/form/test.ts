import { initDb } from '@/service/database'
import { setActivePinia, createPinia } from 'pinia'
import { expect, describe, beforeAll, beforeEach, it, test } from 'vitest'
import { useConnectorStore } from '../connector'
import type { ConnectionProvider } from '@/service/core'
import { useSearchFormStore } from '.'
import { useSearchResultStore } from '../search-result'
import { ingestionQuery } from '@/test-support/initial-data'
import { evalFilterResult } from '@/test-support/eval-result'

describe('Execute search from form', () => {
    let provider: ConnectionProvider

    beforeAll(async () => {
        provider = await initDb()

        setActivePinia(createPinia())
        const connectorStore = useConnectorStore()
        await connectorStore.ingestAsync(provider, ingestionQuery)
    })
    beforeEach(async () => {
        setActivePinia(createPinia())

        const connectorStore = useConnectorStore()
        connectorStore.initOnly(provider)
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

        const needle = { args: { phrase: 'i32', with_slice: false }, returns: { phrase: '' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
    })

    it ("Search return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setReturnAsync("Result")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: '', with_slice: false }, returns: { phrase: 'Result' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
    })

    it ("Search args and return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setReturnAsync("Result")
        await formStore.setArgsAsync("Duration")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: 'Duration', with_slice: false }, returns: { phrase: 'Result' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
    })

    it ("Search args type, then search empty", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        await formStore.setArgsAsync("i32")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: 'i32', with_slice: false }, returns: { phrase: '' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        
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

        const needle = { args: { phrase: '', with_slice: false }, returns: { phrase: 'Result' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        
        await formStore.setReturnAsync("")
        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
    })

    it ("Search args and return type, then be empty args type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)
        
        {
            await formStore.setReturnAsync("Result")
            expect(resultStore.searching).to.be.true

            const needle = { args: { phrase: '', with_slice: false }, returns: { phrase: 'Result' } }
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        }

        {
            await formStore.setArgsAsync("Duration")
            expect(resultStore.searching).to.be.true

            const needle = { args: { phrase: 'Duration', with_slice: false }, returns: { phrase: 'Result' } }
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        }

        {
        await formStore.setArgsAsync("")
            expect(resultStore.searching).to.be.true

            const needle = { args: { phrase: '', with_slice: false }, returns: { phrase: 'Result' } }
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        }
    })

    it ("Search args and return type, then be empty return type", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()

        expect(resultStore.searching).to.be.false
        expect(resultStore.items).to.be.lengthOf(0)

        {
            await formStore.setArgsAsync("i32")
            expect(resultStore.searching).to.be.true

            const needle = { args: { phrase: 'i32', with_slice: false }, returns: { phrase: '' } }
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        }
    
        {
            await formStore.setReturnAsync("f64")
            expect(resultStore.searching).to.be.true

            const needle = { args: { phrase: 'i32', with_slice: false }, returns: { phrase: 'f64' } }
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        }
        
        {
            await formStore.setReturnAsync("")
            expect(resultStore.searching).to.be.true

            const needle = { args: { phrase: 'i32', with_slice: false }, returns: { phrase: '' } }
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
        }
    })

    it("Search args type with slice option", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()
        
        formStore.argOptions.with_slice = true
        expect(resultStore.searching).to.be.false

        await formStore.setArgsAsync("u8")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: 'u8', with_slice: true }, returns: { phrase: '' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
})

    it("Search args type with tuple option", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()
        
        formStore.argOptions.with_tuple = true
        expect(resultStore.searching).to.be.false

        await formStore.setArgsAsync("u8")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: 'u8', with_tuple: true }, returns: { phrase: '' } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
    })

    it("Search return type with slice option", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()
        
        formStore.returnOptions.with_slice = true
        expect(resultStore.searching).to.be.false

        await formStore.setReturnAsync("u8")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: '' }, returns: { phrase: 'u8', with_slice: true } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
    })

    it("Search args type with slice option", async () => {
        const formStore = useSearchFormStore()
        const resultStore = useSearchResultStore()
        
        formStore.returnOptions.with_tuple = true
        expect(resultStore.searching).to.be.false

        await formStore.setReturnAsync("u8")
        expect(resultStore.searching).to.be.true

        const needle = { args: { phrase: '' }, returns: { phrase: 'u8', with_tuple: true } }
        const connectorStore = useConnectorStore()
        await evalFilterResult(await connectorStore.connectAsync(), resultStore.items, needle)
    })
})
