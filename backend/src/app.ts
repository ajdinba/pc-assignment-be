import * as path from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync } from 'fastify'
import { fileURLToPath } from 'node:url'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type AppOptions = {} & Partial<AutoloadPluginOptions>

const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
    // Register CORS plugin (required since client has `strict-origin-when-cross-origin` policy)
    void fastify.register(fastifyCors, {})

    // Register OpenAPI schema generation alongside UI
    void fastify.register(fastifySwagger, {})
    void fastify.register(fastifySwaggerUi, {})

    // Register pregenerated plugins
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: opts,
        forceESM: true,
    })

    // `prefix` is an option supported by `fastify.register`, but it is not defined in `AutoloadPluginOptions`, so it needs to be defined here to pass static type checks.
    interface MyOptions extends AutoloadPluginOptions {
        prefix: string
    }

    // Register all routes in the `routes` directory, prefixed with `/api`
    let myOpts = opts as MyOptions
    myOpts.prefix = '/api'
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: myOpts,
        forceESM: true,
    })
}

export default app
export { app, options }
