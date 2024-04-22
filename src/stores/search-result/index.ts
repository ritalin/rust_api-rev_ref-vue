import { ref } from "vue"

import type { Condition, SearchResult } from "@/types/state_types"
import { defineStore } from "pinia"
import { useConnectorStore } from "../connector"
import { listFunctions } from "./dao"

export const useSearchResultStore = defineStore('search-result', () => {
    const items = ref([] as SearchResult[])
    const searching = ref(false)
    
    const list = async (needle: Condition) => {
        if ((needle.args === '') || (needle.returns === '')) {
            searching.value = false
            return []
        }

        const connectorStore = useConnectorStore()
        const conn = await connectorStore.connect()
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
        searching,
        list 
    }
})