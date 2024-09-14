import * as duckdb from '@duckdb/duckdb-wasm'
import { AsyncDuckDB, type AsyncDuckDBConnection } from '@duckdb/duckdb-wasm'

import type { ConnectionProvider, ConnectionWrapper } from "./core";
import type { Table } from '@apache-arrow/ts';

export const initAsyncDb = async (): Promise<ConnectionProvider> => {
    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

    const c = await caches.open("cache.duckdb")

    const buf_wasm = await loadModule(bundle.mainModule, c)
    const url_wasm = URL.createObjectURL(buf_wasm)

    const buf_worker = await loadModule(bundle.mainWorker!, c)
    const url_worker = URL.createObjectURL(buf_worker);

    const worker = new Worker(url_worker!)
    const logger = import.meta.env.PROD ? new duckdb.VoidLogger(): new duckdb.ConsoleLogger()

    const instance = new AsyncDuckDB(logger, worker)
    await instance.instantiate(url_wasm, bundle.pthreadWorker) 

    URL.revokeObjectURL(url_worker)
    URL.revokeObjectURL(url_wasm)

    return new AsyncDBBindings(instance)
}

const loadModule = async (url: string, cache: Cache) => {
    let res = await cache.match(url)
    if (res === undefined) {
        const fetch_res = await fetch(url)
        await cache.put(url, fetch_res.clone())
        res = fetch_res
    }
    
    return await res.blob()
}

class AsyncDBBindings implements ConnectionProvider {
    instance: AsyncDuckDB
    
    constructor(instance: duckdb.AsyncDuckDB) {
        this.instance = instance
    }

    async connect(): Promise<ConnectionWrapper> {
        return new AsyncDBConnection(this.instance, await this.instance.connect())
    }
}

export class AsyncDBConnection implements ConnectionWrapper {
    db: AsyncDuckDB
    connection: AsyncDuckDBConnection

    constructor(db: AsyncDuckDB, connection: AsyncDuckDBConnection) {
        this.db = db
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

    beginTransaction(): Promise<void> {
        return this.connection.query("begin transaction")
    }

    commit(): Promise<void> {
        return this.connection.query("commit")
    }

    rollback(): Promise<void> {
        return this.connection.query("rollback")
    }

    createResource(name: string, buffer: ArrayBuffer): Promise<void> {
        return this.db.registerFileBuffer(name, new Uint8Array(buffer))
    }
    async dropResource(name: string): Promise<void> {
        await this.db.dropFile(name)
    }
}