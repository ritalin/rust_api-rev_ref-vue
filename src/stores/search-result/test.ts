import { setActivePinia, createPinia } from 'pinia'
import { expect, describe, beforeAll, beforeEach, it, test, assert } from 'vitest'

import type { ConnectionProvider, ConnectionWrapper } from '@/service/core'
import { initDb } from '@/service/database'
import { useConnectorStore } from '../connector'
import { useSearchResultStore } from '.'

describe('Execute search', () => {
    let provider: ConnectionProvider

    beforeAll(async () => {
        provider = await initDb()
    })

    describe('Phrase only', () => {
        beforeEach(() => {
            setActivePinia(createPinia())

            const connectorStore = useConnectorStore()
            connectorStore.ingestAsync(provider, 'src/assets/fixture/search-result')
        })

        it ("Empty phrase of both type", async () => {
            const store = useSearchResultStore()

            const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: '' } })
            expect(store.searching).to.be.false
            expect(results).to.be.lengthOf(0)
        })

        it ("Search arg type", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            const results = await store.listAsync({ args: { phrase: 'i32' }, returns: { phrase: '' }  })
            expect(store.searching).to.be.true

            expect(results).to.be.lengthOf(2)
            expect(results[0].args).to.include("i32")
            expect(results[1].args).to.include("i32")
        })

        it ("Search return type", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            const results = await store.listAsync({ returns: { phrase: 'Result' }, args: { phrase: '' } })
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
            const results = await store.listAsync({ args: { phrase: 'Duration' }, returns: { phrase: 'Result' } })
            expect(store.searching).to.be.true

            expect(results).to.be.lengthOf(2)
            expect(results[0].args).to.include("Duration")
            expect(results[0].returns).to.equal("Result")
            expect(results[1].args).to.include("Duration")
            expect(results[1].returns).to.equal("Result")
        })
    })

    describe('With options', () => {
        beforeEach(() => {
            setActivePinia(createPinia())

            const connectorStore = useConnectorStore()
            connectorStore.ingestAsync(provider, 'public/resources')
        })

        it ("Search arg type with slice member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const results = await store.listAsync({ args: { phrase: 'u8', with_slice: false }, returns: { phrase: '' } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(11)
                expect(results.some(r => r.args.includes('[u8]'))).to.be.false
            }
            
            {
                const results = await store.listAsync({ args: { phrase: 'u8', with_slice: true }, returns: { phrase: '' } })
                expect(store.searching).to.be.true
                expect(results).to.be.lengthOf(104)
                expect(results.some(r => r.args.includes('[u8]'))).to.be.true
            }

            {
                const results = await store.listAsync({ args: { phrase: 'u8', with_slice: false }, returns: { phrase: '' } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(11)
                expect(results.some(r => r.args.includes('[u8]'))).to.be.false
            }
        })

        it ("Search arg type with tuple member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const results = await store.listAsync({ args: { phrase: 'Process', with_tuple: false }, returns: { phrase: '' } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(0)
            }
            
            {
                const results = await store.listAsync({ args: { phrase: 'Process', with_tuple: true }, returns: { phrase: '' } })
                expect(store.searching).to.be.true
                expect(results).to.be.lengthOf(1)
                expect(results.some(r => r.args.map(a => /^\(.+\)$/.test(a) && a.includes("Process")))).to.be.true
            }

            {
                const results = await store.listAsync({ args: { phrase: 'Process', with_tuple: false }, returns: { phrase: '' } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(0)
            }
        })

        it ("Search result type with slice member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: 'u64', with_slice: false } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(20)
                expect(results.some(r => r.returns.includes('[u64]'))).to.be.false
            }
            {
                const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: 'u64', with_slice: true } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(21)
                expect(results.some(r => r.returns.includes('[u64]'))).to.be.true
            }
            {
                const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: 'u64', with_slice: false } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(20)
                expect(results.some(r => r.returns.includes('[u64]'))).to.be.false
            }
        })

        it ("Search result type with tuple member", async () => {
            const store = useSearchResultStore()

            expect(store.searching).to.be.false
            {
                const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: 'f64', with_tuple: false } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(40)

                expect(results.some(r => /^\(.+\)$/.test(r.returns) && r.returns.includes("f64"))).to.be.false
            }
            {
                const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: 'f64', with_tuple: true } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(42)
                expect(results.some(r => /^\(.+\)$/.test(r.returns) && r.returns.includes("f64"))).to.be.true
            }
            {
                const results = await store.listAsync({ args: { phrase: '' }, returns: { phrase: 'f64', with_tuple: false } })
                expect(store.searching).to.be.true     
                expect(results).to.be.lengthOf(40)
                expect(results.some(r => /^\(.+\)$/.test(r.returns) && r.returns.includes("f64"))).to.be.false
            }
        })
    })
})
