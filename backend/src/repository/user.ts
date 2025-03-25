import { FastifyRequest } from 'fastify'
import { db } from '../db.js'
import { Transaction, User } from '../../models.js'

// We define two DTO types to be used:
// - `TransactionDto` is the same as `Transaction` but without the `userId` field
// - `UserDto` is the same as `User` but with the `dateOfBirth` field as a string
export interface TransactionDto extends Omit<Transaction, 'userId'> {}
export interface UserDto extends Omit<User, 'dateOfBirth'> {
    dateOfBirth: string
}

export class UserRepository {
    static async getUserBalance(request: FastifyRequest, id: number) {
        const r = await db
            .selectFrom('users')
            .select('currentBalance')
            .where('id', '=', id)
            .execute()
        try {
            return r[0].currentBalance
        } catch (err) {
            request.log.error(err)
            return null
        }
    }

    static async getUserTransactionsAverage(
        id: number,
        type: 'Deposit' | 'Withdrawal'
    ) {
        const r = await db
            .selectFrom('transactions')
            // `eb` - Expression Builder
            .select((eb) => eb.fn.avg('amount').as('averageAmount'))
            .where('userId', '=', id)
            .where('type', '=', type)
            .execute()

        if (!r[0].averageAmount) {
            return null
        }
        return parseFloat(r[0].averageAmount as string)
    }

    static async getUserTransactions(id: number) {
        return (
            (await db
                .selectFrom('transactions')
                .select(['id', 'amount', 'type', 'timestamp'])
                .where('userId', '=', id)
                // `unknown` is necessary since `Generated<number>` gets converted to `ColumnType<number, number | undefined, number>`
                .execute()) as unknown as TransactionDto[]
        )
    }

    static async getUser(request: FastifyRequest, id: number) {
        const r = await db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', id)
            .execute()
        try {
            const user = r[0]

            // This cast is data-valid since we do the conversion for `dateOfBirth` in the next statement
            const userDto = user as unknown as UserDto

            userDto.dateOfBirth = user.dateOfBirth
                ?.toISOString()
                .split('T')[0] as string

            return userDto
        } catch (err) {
            request.log.error(err)
            return null
        }
    }
}
