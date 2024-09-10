import type { StructRowProxy } from "@apache-arrow/ts"

import type { ConnectionWrapper } from "@/service/core"
import type { ConditionSet, Crate, SearchResult } from "@/types/state_types"

import { type TypeCategory } from '@/types/user-types/TypeCategory'
import queryListFunctions from '@/types/listFunctions/query.sql?raw'
import * as ListFunctions from '@/types/listFunctions/types'
import queryListCrates from '@/types/listCrates/query.sql?raw'

export const listFunctions = async (conn: ConnectionWrapper, needle: ConditionSet): Promise<SearchResult[]> => {
    console.log("(parameters)", needle)

    try {
        const emptieSet = ["", null, undefined]
        const params: ListFunctions.Parameter = {
            crateId: Number(needle.crateId),
            retPhrase: emptieSet.includes(needle.returns.phrase) ? null : needle.returns.phrase as TypeCategory,
            retCat1: needle.returns.withSlice ? 'slice' as TypeCategory : null,
            retCat2: needle.returns.withTuple ? 'tuple' as TypeCategory :  null,
            argPhrase: emptieSet.includes(needle.args.phrase) ? null : needle.args.phrase as TypeCategory,
            argCat1: needle.args.withSlice ? 'slice' as TypeCategory : null,
            argCat2: needle.args.withTuple ? 'tuple' as TypeCategory : null
        };

        const results = await conn.runQuery(
            queryListFunctions, 
            ...ListFunctions.ParameterOrder.map(o => params[o])
        )

        const items =  results.toArray().map((row: StructRowProxy<any>) => {
            return {
                id: row.id,
                qualSymbol: row.qual_symbol,
                since: row.since,
            } as SearchResult
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