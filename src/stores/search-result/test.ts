import { setActivePinia, createPinia } from 'pinia'
import { expect, describe, beforeAll, beforeEach, it, test, assert } from 'vitest'

import type { ConnectionProvider, ConnectionWrapper } from '@/service/core'
import { initDb } from '@/service/database'
import { useConnectorStore } from '../connector'
import { useSearchResultStore } from '.'

import { ingestionQuery } from '@/test-support/initial-data'
import { evalFilterResult } from '@/test-support/eval-result'

describe('Execute search', () => {
    let provider: ConnectionProvider

    beforeAll(async () => {
        provider = await initDb()
            setActivePinia(createPinia())
            const connectorStore = useConnectorStore()
            await connectorStore.ingestAsync(provider, ingestionQuery)
    })

    describe('Phrase only', () => {
        beforeEach(async () => {
            setActivePinia(createPinia())
            const connectorStore = useConnectorStore()
            connectorStore.initOnly(provider)
        })

        it ("Empty phrase of both type", async () => {
            const store = useSearchResultStore()

            const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: '' } })
            expect(store.searching).to.be.false
            expect(results).to.be.lengthOf(0)
        })

        it ("Search arg type", async () => {
            const store = useSearchResultStore()

            const needle = { args: { phrase: 'i32' }, returns: { phrase: '' } }
            
            expect(store.searching).to.be.false
            const results = await store.listAsync(needle)
            expect(store.searching).to.be.true
            
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), results, needle)
        })

        it ("Search return type", async () => {
            const store = useSearchResultStore()

            const needle = { returns: { phrase: 'Result' }, args: { phrase: '' } }

            expect(store.searching).to.be.false
            const results = await store.listAsync(needle)
            expect(store.searching).to.be.true
            
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), results, needle)
        })

        it ("Search arg and return type", async () => {
            const store = useSearchResultStore()

            const needle = { args: { phrase: 'Duration' }, returns: { phrase: 'Result' } }

            expect(store.searching).to.be.false
            const results = await store.listAsync(needle)
            expect(store.searching).to.be.true
            
            const connectorStore = useConnectorStore()
            await evalFilterResult(await connectorStore.connectAsync(), results, needle)
        })
    })

    describe('With options', () => {
        beforeEach(async () => {
            setActivePinia(createPinia())
            const connectorStore = useConnectorStore()
            connectorStore.initOnly(provider)
        })

        it ("Search arg type with slice member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const needle = { args: { phrase: 'u8', with_slice: false }, returns: { phrase: '' } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
            
            {
                const needle = { args: { phrase: 'u8', with_slice: true }, returns: { phrase: '' } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }

            {
                const needle = { args: { phrase: 'u8', with_slice: false }, returns: { phrase: '' } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
        })

        it ("Search arg type with tuple member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const needle = { args: { phrase: 'Process', with_tuple: false }, returns: { phrase: '' } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
            
            {
                const needle = { args: { phrase: 'Process', with_tuple: true }, returns: { phrase: '' } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }

            {
                const needle = { args: { phrase: 'Process', with_tuple: false }, returns: { phrase: '' } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
        })

        it ("Search result type with slice member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const needle = { args: { phrase: '' }, returns: { phrase: 'u64', with_slice: false } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
            {
                const needle = { args: { phrase: '' }, returns: { phrase: 'u64', with_slice: true } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
            {
                const needle = { args: { phrase: '' }, returns: { phrase: 'u64', with_slice: false } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
        })

        it ("Search result type with tuple member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const needle = { args: { phrase: '' }, returns: { phrase: 'f64', with_tuple: false } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
            {
                const needle = { args: { phrase: '' }, returns: { phrase: 'f64', with_tuple: true } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
            {
                const needle = { args: { phrase: '' }, returns: { phrase: 'f64', with_tuple: false } }
                const results = await store.listAsync(needle)
                expect(store.searching).to.be.true     

                const connectorStore = useConnectorStore()
                await evalFilterResult(await connectorStore.connectAsync(), results, needle)
            }
        })
    })
})
