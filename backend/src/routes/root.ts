import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Empty 200 route for hypothetical health checks
    fastify.get('/', async function (request, reply) {
        return {
            status: 'ok',
        }
    })
}

export default root
