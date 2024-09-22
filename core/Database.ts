import { DB, QueryParameterSet } from "@sqlite"
import { Log } from "/core/libs/Log.ts"
import { migrations } from "/core/migrations/list.ts"

export class Database {
    private static _db: DB

    static initialize(path: string = ":memory:") {
        this._db = new DB(path)

        // Create migrations table
        this._db.execute(
            `CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY) WITHOUT ROWID;`
        )

        // Run migrations if needed
        migrations.forEach((migration) => {
            if (!this.queryValue("SELECT 1 FROM migrations WHERE name = ?", [migration.id])) {
                this._db.execute(migration.sql)
                this.queryOne("INSERT INTO migrations (name) VALUES (?)", [migration.id])

                Log.info(`Database: Executed migration: ${migration.id}`)
            }
        })

        Log.info("Database: initialized!")
    }

    static queryRow<R extends (string | number)[]>(sql: string, params: QueryParameterSet): R | null {
        return this._db.query<R>(sql, params)[0] ?? null
    }

    static queryValue<V extends string | number>(sql: string, params: QueryParameterSet): V | null {
        const [value] = this.queryRow<[V]>(sql, params) ?? [null]
        return value
    }

    static queryOne<R extends TableSchema>(sql: string, params: QueryParameterSet): R | null {
        return this.queryAll<R>(sql, params)[0] ?? null
    }

    static queryAll<R extends TableSchema>(sql: string, params: QueryParameterSet): R[] {
        return this._db.queryEntries<R>(sql, params)
    }

    static execute(sql: string, params?: QueryParameterSet): void {
        if (params == undefined) {
            this._db.execute(sql + ";")
        } else {
            this._db.query(sql, params)
        }
    }

    static transaction(callback: () => void): void {
        this._db.transaction(callback)
    }
}

type TableSchema = {
    [key: string]: string | number | null
}
