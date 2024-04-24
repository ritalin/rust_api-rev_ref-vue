import * as duckdb from '@duckdb/duckdb-wasm'
import { AsyncDuckDB, type AsyncDuckDBConnection } from '@duckdb/duckdb-wasm'

import type { ConnectionProvider, ConnectionWrapper } from "./core";
import type { Table } from '@apache-arrow/ts';

import duckdb_wasm_mvp from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'

import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

export const initAsyncDb = async (): Promise<ConnectionProvider> => {
    const bundles: duckdb.DuckDBBundles = {
        mvp: {
            mainModule: duckdb_wasm_mvp,
            mainWorker: mvp_worker, 
        },
        eh: {
            mainModule: duckdb_wasm_eh,
            mainWorker: eh_worker,
        },
    }

    const selected_bundle = await duckdb.selectBundle(bundles)

    const worker = new Worker(selected_bundle.mainWorker!)
    const logger = new duckdb.ConsoleLogger()

    const instance = new AsyncDuckDB(logger, worker)
    await instance.instantiate(selected_bundle.mainModule, selected_bundle.pthreadWorker) 

    return new AsyncDBBindings(instance)
}

class AsyncDBBindings implements ConnectionProvider {
    instance: AsyncDuckDB
    
    constructor(instance: duckdb.AsyncDuckDB) {
        this.instance = instance
    }

    async connect(): Promise<ConnectionWrapper> {
        return new AsyncDBConnection(await this.instance.connect())
    }
}

class AsyncDBConnection implements ConnectionWrapper {
    connection: AsyncDuckDBConnection

    constructor(connection: AsyncDuckDBConnection) {
        this.connection = connection
    }

    async runQuery(query: string, ...args: any[]): Promise<Table<any>> {
        const stmt = await this.connection.prepare(query)

        return stmt.query(...args)
    }
    
    runScript(query: string): Promise<Table<any>> {
        return this.connection.query(query)
    }

    close(): Promise<void> {
        return this.connection.close()
    }
}