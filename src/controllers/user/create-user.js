import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emaiIslAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
    requiredFieldsMissingResponse,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpsRequest) {
        try {
            const params = httpsRequest.body

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldsMissingResponse(missingField)
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return emaiIslAlreadyInUseResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

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
