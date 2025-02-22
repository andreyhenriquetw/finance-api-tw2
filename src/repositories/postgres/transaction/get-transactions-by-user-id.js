import { PostgresHelper } from '../../../db/postgres/helper'

export class PostgresGetTransactionsByUserId {
    async execute(userId) {
        const trasactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        )

        return trasactions
    }
}
