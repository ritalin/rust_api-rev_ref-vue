import type { StructRowProxy } from "@apache-arrow/ts"

import type { ConnectionWrapper } from "@/service/core"
import type { ConditionSet, SearchResult } from "@/types/state_types"

import query from '@/assets/sql/listFunctions.sql?raw'

export const listFunctions = async (conn: ConnectionWrapper, needle: ConditionSet): Promise<SearchResult[]> => {
    console.log("(parameters)", needle)

    try {
        const emptieSet = ["", null, undefined]
        const results = await conn.runQuery(
            query, 
            needle.returns.with_slice ? 'slice' : null,
            needle.returns.with_tuple ? 'tuple' :  null,
            emptieSet.includes(needle.returns.phrase) ? null : needle.returns.phrase, 
            needle.args.with_slice ? 'slice' : null,
            needle.args.with_tuple ? 'tuple' : null,
            emptieSet.includes(needle.args.phrase) ? null : needle.args.phrase
        )

        const items =  results.toArray().map((row: StructRowProxy<any>) => {
            return {
                name: row.name,
                args: row.args.toArray().map((arg: any) => arg.toString()),
                returns: row.returns,
                deprecated_since: row.since,
            }
        })
        console.log("(result)", items.length)

        return items
    }
    catch (ex) {
        console.error(ex)

        return []
    }
}