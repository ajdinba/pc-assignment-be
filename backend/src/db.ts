import type { DB } from '../models.d.ts'
import { createPool } from 'mysql2'
import { CamelCasePlugin, Kysely, MysqlDialect } from 'kysely'

// https://kysely.dev/docs/getting-started?dialect=mysql#instantiation
const dialect = new MysqlDialect({
    pool: createPool({
        database: process.env.DB_NAME || 'bankapp',
        host: process.env.DB_HOST || 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD || 'root',
        port: process.env.DB_PORT || 3306,
    }),
})

// Export the instance which will be used as the sole interface to the database
export const db = new Kysely<DB>({
    dialect,
    // Necessary because the frontend expects camelCase
    plugins: [new CamelCasePlugin()],
    // https://kysely.dev/docs/recipes/logging#1-provide-an-array-with-log-levels
    log: ['error'],
})
