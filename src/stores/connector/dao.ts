import type { ConnectionWrapper } from "@/service/core"
import type { StructRowProxy, Table } from "@apache-arrow/ts"

import dbschema from '@/assets/sql/schema.sql?raw'

export type IngestionQuery = (conn: ConnectionWrapper) => Promise<void> 

export const createSchemaCore = async (conn: ConnectionWrapper) => {
    await conn.runScript(dbschema)
}

export const ingestCore = async (conn: ConnectionWrapper, namespace: string) => {
    conn.runScript(`copy deprecated from '${namespace}/deprecated.parquet' (FORMAT PARQUET)`)
    
    const tablenames = [
        "crate_symbol",
        // "deprecated",
        "prototype_deprecated_ref",
        "prototype",
        "prototype_crate_ref",
        "prototype_type_ref",
        "type_symbol",
    ]

    for (let name of tablenames) {
        const sql = `copy ${name} from '${namespace}/${name}.json' (FORMAT 'json', array 'true')`
        await conn.runScript(sql)
    }

}
