declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_NAME?: string
            DB_PASSWORD?: string
            DB_PORT?: number
        }
    }
}

export {}
