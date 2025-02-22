import { UserNotFoundError } from '../../errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldsMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers'

export class GetTransactionsByUserId {
    constructor(GetTransactionsByUserIdUseCase) {
        this.GetTransactionsByUserIdUseCase = GetTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.GetTransactionsByUserIdUseCase.execute({
                    userId,
                })

            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
