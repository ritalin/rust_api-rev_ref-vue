import type { ConnectionWrapper } from "@/service/core"
import type { StructRowProxy, Table } from "@apache-arrow/ts"

import type_category from '@/assets/schemas/types/type_category.sql?raw'
import type_kind from '@/assets/schemas/types/type_kind.sql?raw'
import tableSchemas from '@/assets/schemas/schema.sql?raw'

export type IngestionQuery = (conn: ConnectionWrapper) => Promise<void> 

export const createSchemaCore = async (conn: ConnectionWrapper) => {
    await conn.beginTransaction()
    try {
        await conn.runQuery(type_category)
        await conn.runQuery(type_kind)
        await conn.runScript(tableSchemas)
        conn.commit()
    }
    catch (_) {
        conn.rollback()
    }
}

export const ingestCore = async (conn: ConnectionWrapper, namespace: string) => {
    const tablenames = [
        "crate_symbol",
        "deprecated",
        "prototype_deprecated_ref",
        "prototype",
        "prototype_crate_ref",
        "prototype_type_ref",
        "type_symbol",
    ]

    for (let name of tablenames) {
        const sql = `copy ${name} from '${namespace}/${name}.parquet' (FORMAT PARQUET)`
        await conn.runScript(sql)
    }

}
