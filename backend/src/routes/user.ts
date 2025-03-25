import { FastifyPluginAsync, RouteShorthandOptions } from 'fastify'
import { FastifySchemaBuilder } from '../utils/FastifySchemaBuilder.js'
import { UserRepository } from '../repository/user.js'
import { notFoundError } from '../errors.js'
import { OpenApiType } from '../responses.js'

// The same schema is used for the three number-returning routes so we'll define it here and reuse it
const numberReturnSchema = new FastifySchemaBuilder()
    .setQuerystring({ id: 'number' })
    .addResponse(200, 'Success', OpenApiType.NUMBER)
    .addResponse(404, 'Not Found', OpenApiType.OBJECT, {
        message: OpenApiType.STRING,
    })
    .build()

const numberReturnOpts: RouteShorthandOptions = {
    schema: numberReturnSchema,
}

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/balance', numberReturnOpts, async function (request, reply) {
        const { id } = request.query as { id: number }
        if (!id) {
            return notFoundError(reply)
        }

        const r = UserRepository.getUserBalance(request, id)
        if (!r) {
            return notFoundError(reply)
        }

        return r
    })

    fastify.get(
        '/average-deposit',
        numberReturnOpts,
        async function (request, reply) {
            const { id } = request.query as { id: number }
            if (!id) {
                return notFoundError(reply)
            }

            const r = await UserRepository.getUserTransactionsAverage(
                id,
                'Deposit'
            )
            if (!r) {
                return notFoundError(reply)
            }

            return r
        }
    )

    fastify.get(
        '/average-withdraw',
        numberReturnOpts,
        async function (request, reply) {
            const { id } = request.query as { id: number }
            if (!id) {
                return notFoundError(reply)
            }

            const r = await UserRepository.getUserTransactionsAverage(
                id,
                'Withdrawal'
            )
            if (!r) {
                return notFoundError(reply)
            }

            return r
        }
    )

    const transactionSchema = new FastifySchemaBuilder()
        .setQuerystring({ id: 'number' })
        // NOTE: `addResponse` could be further improved by allowing typedefs for array items
        .addResponse(200, 'Success', OpenApiType.ARRAY)
        .addResponse(404, 'Not Found', OpenApiType.OBJECT, {
            message: OpenApiType.STRING,
        })
        .build()
    fastify.get(
        '/transactions',
        { schema: transactionSchema },
        async function (request, reply) {
            const { id } = request.query as { id: number }
            if (!id) {
                return notFoundError(reply)
            }

            const r = await UserRepository.getUserTransactions(id)
            if (r.length === 0) {
                return notFoundError(reply)
            }

            return r
        }
    )

    const userSchema = new FastifySchemaBuilder()
        .setQuerystring({ id: 'number' })
        .addResponse(200, 'Success', OpenApiType.OBJECT, {
            id: OpenApiType.INTEGER,
            firstName: OpenApiType.STRING,
            lastName: OpenApiType.STRING,
            email: OpenApiType.STRING,
            dateOfBirth: OpenApiType.STRING,
            phoneNumber: OpenApiType.STRING,
            accountNumber: OpenApiType.STRING,
            currentBalance: OpenApiType.NUMBER,
        })
        .addResponse(404, 'Not Found', OpenApiType.OBJECT, {
            message: OpenApiType.STRING,
        })
        .build()
    fastify.get(
        '/user',
        { schema: userSchema },
        async function (request, reply) {
            const { id } = request.query as { id: number }
            if (!id) {
                return notFoundError(reply)
            }

            const r = await UserRepository.getUser(request, id)
            if (!r) {
                return notFoundError(reply)
            }

            return r
        }
    )
}

export default user
