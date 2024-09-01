import * as duckdb from '@duckdb/duckdb-wasm/blocking'
import type { DuckDBBindings, DuckDBConnection } from '@duckdb/duckdb-wasm/blocking'
import type { Table } from '@apache-arrow/ts'

import type { ConnectionProvider, ConnectionWrapper } from "./core";

const NODE_RUNTIME = require('@duckdb/duckdb-wasm/blocking').NODE_RUNTIME

export const initDb = async (): Promise<ConnectionProvider> => {
    const logger = new duckdb.ConsoleLogger()
        
    const bundle: duckdb.DuckDBBundles = {
        mvp: {
            mainModule: 'node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm',
            mainWorker: 'node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-mvp.worker.js', 
        },
        eh: {
            mainModule: 'node_modules/@duckdb/duckdb-wasm/dist/duckdb-eh.wasm',
            mainWorker: 'node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-eh.worker.js',
        },
    }
    const instance = await duckdb.createDuckDB(bundle, logger, NODE_RUNTIME);
    await instance.instantiate(_ => {})

    return new BlockingDBBindings(instance)
}

class BlockingDBBindings implements ConnectionProvider {
    instance: DuckDBBindings

    constructor(instance: DuckDBBindings) {
        this.instance = instance
    }

    async connect(): Promise<ConnectionWrapper> {
        return new BlockingConnection(this.instance.connect())
    }
}

class BlockingConnection implements ConnectionWrapper {
    connection: DuckDBConnection

    constructor(connection: DuckDBConnection) {
        this.connection = connection
    }

    async runQuery(query: string, ...args: any[]): Promise<Table<any>> {
        const stmt = this.connection.prepare(query)

        return stmt.query(...args)
    }
    async runScript(query: string): Promise<Table<any>> {
        return this.connection.query(query)
    }
    async close(): Promise<void> {
        this.connection.close()
    }    

    async beginTransaction(): Promise<void> {
        return this.connection.query("begin transaction")
    }

    async commit(): Promise<void> {
        return this.connection.query("commit")
    }

    async rollback(): Promise<void> {
        return this.connection.query("rollback")
    }}