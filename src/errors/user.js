export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The provided ${email} e-mail is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
