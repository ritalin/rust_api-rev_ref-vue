import type { StructRowProxy } from "@apache-arrow/ts"

import type { ConnectionWrapper } from "@/service/core"
import type { ConditionSet, Crate, SearchResult } from "@/types/state_types"

import queryListFunctions from '@/assets/sql/listFunctions.sql?raw'
import queryListCrates from '@/assets/sql/listCrates.sql?raw'

export const listFunctions = async (conn: ConnectionWrapper, needle: ConditionSet): Promise<SearchResult[]> => {
    console.log("(parameters)", needle)

    try {
        const emptieSet = ["", null, undefined]
        const results = await conn.runQuery(
            queryListFunctions, 
            Number(needle.crateId),
            emptieSet.includes(needle.returns.phrase) ? null : needle.returns.phrase, 
            needle.returns.withSlice ? 'slice' : null,
            needle.returns.withTuple ? 'tuple' :  null,
            emptieSet.includes(needle.args.phrase) ? null : needle.args.phrase,
            needle.args.withSlice ? 'slice' : null,
            needle.args.withTuple ? 'tuple' : null,
        )

        const items =  results.toArray().map((row: StructRowProxy<any>) => {
            return {
                id: row.id,
                qualName: row.qual_symbol,
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

export const listCrates = async (conn: ConnectionWrapper): Promise<Crate[]> => {
    const rows = await conn.runQuery(queryListCrates)
    
    return rows.toArray().map((row: StructRowProxy<any>) => {
        return {
            id: row.id,
            name: row.symbol,
        }
    })
}