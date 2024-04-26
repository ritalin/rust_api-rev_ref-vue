import { ref } from "vue"

import type { ConditionSet, SearchResult } from "@/types/state_types"
import { defineStore } from "pinia"
import { useConnectorStore } from "../connector"
import { listFunctions } from "./dao"

export const useSearchResultStore = defineStore('search-result', () => {
    const items = ref([] as SearchResult[])
    const searching = ref(false)
    
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

    return { 
        searching, items,
        listAsync 
    }
})