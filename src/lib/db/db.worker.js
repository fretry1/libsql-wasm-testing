import { createClient } from "@libsql/client-wasm";
import { expose } from "comlink";

export class DB {
    #db = createClient({ url: "file:local.db" })

    async init() {
        console.debug("DB: initializing...")
        await this.#db.execute(`
            CREATE TABLE IF NOT EXISTS counters (
                id    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                value INTEGER NOT NULL DEFAULT 0
            ) strict;
        `)
        const res = await this.#db.execute(
            "SELECT * FROM counters"
        )
        console.debug(`DB: found ${res.rows.length} rows when db was opened`)
    }

    /**@throws {Error} */
    async getCounters() {
        const res = await this.#db.execute(
            "SELECT * FROM counters ORDER BY id ASC"
        )
        return res.rows
    }

    /**@returns {Promise<Counter>}
     * @throws {Error}*/
    async createCounter() {
        const res = await this.#db.execute({
            sql: `INSERT INTO counters DEFAULT VALUES RETURNING *`,
            args:[]
        })
        const row = res.rows[0]
        if (!row) {
            throw new Error("DB createCounter: no rows returned after insert")
        }
        return {
            id: Number(row.id),
            value: Number(row.value),
        }
    }

    /**@param {number} id
     * @returns {Promise<Counter>}
     * @throws {Error}*/
    async incrementCounter(id) {
        const res = await this.#db.execute({
            sql: "UPDATE counters SET VALUE = VALUE + 1 WHERE id = ? RETURNING *",
            args: [id],
        })
        const row = res.rows[0]
        if (!row) {
            throw new Error(`DB incrementCounter: couldn't find/update counter with id ${id}`)
        }
        return {
            id: Number(row.id),
            value: Number(row.value),
        }
    }

    async close() {
        this.#db.close()
    }
}

expose(new DB())
