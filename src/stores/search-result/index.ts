import { ref } from "vue"

import type { ConditionSet, Crate, SearchResult } from "@/types/state_types"
import { defineStore } from "pinia"
import { useConnectorStore } from "../connector"
import { listCrates, listFunctions } from "./dao"

export const useSearchResultStore = defineStore('search-result', () => {
    const items = ref([] as SearchResult[])
    const searching = ref(false)
    const show_deprecated = ref(false)
    const crates = ref([] as Crate[])
    
    const listAsync = async (needle: ConditionSet) => {
        if ((needle.args.phrase === '') && (needle.returns.phrase === '')) {
            items.value = []
            searching.value = false
            return []
        }

        const connectorStore = useConnectorStore()
        const conn = await connectorStore.connectAsync()
        try {
            items.value = await listFunctions(conn, needle)
            searching.value = true

            return items.value
        }
        finally {
            await conn.close()
        }
    }

    const DEFAULT_CRATE_NAME = 'std';

    const initCrates = async () => {
        const connectorStore = useConnectorStore()
        const conn = await connectorStore.connectAsync()
        try {
            crates.value = await listCrates(conn)
            const crate_def = crates.value.find(x => x.name === DEFAULT_CRATE_NAME)!

            return crate_def ? crate_def.id : null
        }
        finally {
            await conn.close()
        }
    }

    return { 
        searching, items, show_deprecated, crates,
        initCrates, listAsync
    }
})