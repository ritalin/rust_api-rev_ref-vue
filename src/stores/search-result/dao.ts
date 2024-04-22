import type { StructRowProxy } from "@apache-arrow/ts"

import type { ConnectionWrapper } from "@/service/core"
import type { Condition, SearchResult } from "@/types/state_types"

import query from '@/assets/sql/listFunctions.sql?raw'

export const listFunctions = async (conn: ConnectionWrapper, needle: Condition): Promise<SearchResult[]> => {
    try {
        const emptieSet = ["", null, undefined]
        const results = await conn.runQuery(
            query, 
            emptieSet.includes(needle.returns) ? null : needle.returns, 
            emptieSet.includes(needle.args) ? null : needle.args
        )

        const items =  results.toArray().map((row: StructRowProxy<any>) => {
            return {
                name: row.qual_symbol,
                args: row.args.toArray().map((arg: any) => arg.toString()),
                returns: row.returns,
            }
        })

        return items
    }
    catch (ex) {
        console.error(ex)

        return []
    }
}