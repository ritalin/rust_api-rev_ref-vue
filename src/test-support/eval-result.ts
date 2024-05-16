import type { ConnectionWrapper } from "@/service/core";
import type { Condition, ConditionSet, SearchResult } from "@/types/state_types";
import { type StructRowProxy } from "@apache-arrow/ts";
import { expect } from "vitest";

type TypeFilterResult = string

type FilterResult = {
    args: TypeFilterResult[]
    returns: TypeFilterResult[]
}

export const evalFilterResult = async (conn: ConnectionWrapper, results: SearchResult[], needle: ConditionSet) => {
    try {
        const ids = await keepSeachResult(conn, results, 10)
        const filter_results = await listFilterTypes(conn, ids, needle)

        expect(filter_results.length).to.be.equal(ids.length)
        
        filter_results.forEach(r => {
            if (needle.args.phrase) {
                evalTypeFilterResult(r.args, needle.args)
            }
            if (needle.returns.phrase) {
                evalTypeFilterResult(r.returns, needle.returns)
            }
        })
    }
    catch (ex) {
        console.log("error: evalFilterResult", ex)
    }
    finally {
        await conn.close()
    } 
}

const keepSeachResult = async (conn: ConnectionWrapper, results: SearchResult[], max_limit: number) => {
    const limit = Math.min(results.length, max_limit)

    await conn.runScript("create or replace temporary table prototype_id (id int primary key)")

    let ids: number[] = []

    for (let i = 0; i < limit; ++i) {
        const id = Number(results[i].id)
        ids.push(id)
        await conn.runQuery("insert into prototype_id values (?)", id)
    }

    return ids
}

const listFilterTypes = async (conn: ConnectionWrapper, ids: number[], needle: ConditionSet): Promise<FilterResult[]> => {
    const sql = `select prototype_id as id, symbol, kind, category
    from prototype_type_ref t1
    join type_symbol t2 on t1.type_id = t2.id
    where exists (from prototype_id ts1 where ts1.id = t1.prototype_id) 
    `

    const rows = await conn.runQuery(sql)

    const arg_cats = makeCategorySet(needle.args)
    const ret_cats = makeCategorySet(needle.returns)

    let results: Map<number, FilterResult> = new Map<number, FilterResult>(ids.map(id => [id, { args: [], returns: [] }]))

    rows.toArray().forEach((row: StructRowProxy<any>) => {
        const x: TypeFilterResult = row.symbol

        let result = results.get(Number(row.id))!

        if ((row.kind === 'arg') && arg_cats.includes(row.category)) {
            result.args.push(x)
        }
        else if ((row.kind === 'return') && ret_cats.includes(row.category)) {
            result.returns.push(x)
        }
    })

    return Array.from(results.values())
}

const evalTypeFilterResult = (results: TypeFilterResult[], needle: Condition) => {
    expect(results).to.be.not.equal([])
    expect(results).to.be.includes(needle.phrase)
}

const makeCategorySet = (needle: Condition): string[] => {
    let categories = ['nominal']
    if (needle.withSlice) categories.push('slice')
    if (needle.withTuple) categories.push('tuple')
    
    return categories
}