import { EmailAlreadyInUseError } from '../errors/user.js'
import { CreateUserUseCase } from '../use-cases/create-user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emaiIslAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
} from './helpers/index.js'

export class CreateUserController {
    async execute(httpsRequest) {
        try {
            const params = httpsRequest.body

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return emaiIslAlreadyInUseResponse()
            }

            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
