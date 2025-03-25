import { FastifyReply } from 'fastify'

// This file is a collection of error handling functions that can be used in the application
// For this app, only one function is defined and used, but this would usually contain more of such helper functions for a complex application
export const notFoundError = (reply: FastifyReply) => {
    reply.status(404)
    return { message: 'RESOURCE_NOT_FOUND' }
}
