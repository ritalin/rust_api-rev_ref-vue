import { setActivePinia, createPinia } from 'pinia'
import { expect, describe, beforeAll, beforeEach, it, test, assert } from 'vitest'

import type { ConnectionProvider, ConnectionWrapper } from '@/service/core'
import { initDb } from '@/service/database'
import { useConnectorStore } from '../connector'
import { useSearchResultStore } from '.'

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

    it ("Empty phrase of both type", async () => {
        const store = useSearchResultStore()

        const results = await store.listAsync({ args: '', returns: '' })
        expect(store.searching).to.be.false
        expect(results).to.be.lengthOf(0)
    })

    it ("Search arg type", async () => {
        const store = useSearchResultStore()

        expect(store.searching).to.be.false
        const results = await store.listAsync({ args: 'i32' })
        expect(store.searching).to.be.true

        expect(results).to.be.lengthOf(2)
        expect(results[0].args).to.include("i32")
        expect(results[1].args).to.include("i32")
    })

    it ("Search return type", async () => {
        const store = useSearchResultStore()

        expect(store.searching).to.be.false
        const results = await store.listAsync({ returns: 'Result' })
        expect(store.searching).to.be.true

        expect(results).to.be.lengthOf(5)
        expect(results[0].returns).to.equal("Result")
        expect(results[1].returns).to.equal("Result")
        expect(results[2].returns).to.equal("Result")
        expect(results[3].returns).to.equal("Result")
        expect(results[4].returns).to.equal("Result")
    })

    it ("Search arg and return type", async () => {
        const store = useSearchResultStore()

        expect(store.searching).to.be.false
        const results = await store.listAsync({ args: 'Duration', returns: 'Result' })
        expect(store.searching).to.be.true

        expect(results).to.be.lengthOf(2)
        expect(results[0].args).to.include("Duration")
        expect(results[0].returns).to.equal("Result")
        expect(results[1].args).to.include("Duration")
        expect(results[1].returns).to.equal("Result")
    })
})


