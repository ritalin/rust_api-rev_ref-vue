import type { Table } from '@apache-arrow/ts'

export interface ConnectionProvider {
    connect(): Promise<ConnectionWrapper>,
}
export interface ConnectionWrapper {
    runQuery(query: string, ...args: any[]): Promise<Table>,
    runScript(query: string): Promise<Table>,
    close(): Promise<void>,
    beginTransaction(): Promise<void>,
    commit(): Promise<void>,
    rollback(): Promise<void>,
}
