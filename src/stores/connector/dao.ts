import type { ConnectionWrapper } from "@/service/core"
import type { StructRowProxy, Table } from "@apache-arrow/ts"

import dbschema from '@/assets/sql/schema.sql?raw'
import dbschemaCreated from '@/assets/sql/schemaCreated.sql?raw'
import truncateAll from '@/assets/sql/truncateAll.sql?raw'
import insertPrototype from '@/assets/sql/insertPrototype.sql?raw'
import insertTypeSymbol from '@/assets/sql/insertTypeSymbol.sql?raw'
import insertTypeRef from '@/assets/sql/insertTypeRef.sql?raw'
import deprecated from '@/assets/sql/deprecated.sql?raw'
import deprecated_prototype_ref from '@/assets/sql/deprecated_prototype_ref.sql?raw'

export const createSchemaCore = async (conn: ConnectionWrapper) => {
    const results: Table = await conn.runScript(dbschemaCreated)
    const schemaExists = results.get(0)

    if (!schemaExists!.has_schema) {
        await conn.runScript(dbschema)
    }
}

export const truncateCore = async (conn: ConnectionWrapper) => {
    await conn.runScript(truncateAll)
}

export const ingestCore = async (conn: ConnectionWrapper, namespace: string) => {
    const results = await Promise.all([insertPrototype, insertTypeSymbol, insertTypeRef, deprecated, deprecated_prototype_ref].map(async (q) => {
        return await conn.runQuery(q, namespace)
    }))

    console.log(results.map(r => r.toArray().map((a: StructRowProxy<any>) => a.toString())))
}