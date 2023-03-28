import User from "../user.interface"

export default interface LoginInterface {
    execute(email: string, password: string): Promise<Login.Response>
}

interface NotVerified {
    email: string,
    message: string,
}

interface Verified {
    user: User,
    accessToken: string,
    refreshToken: string
}

export namespace Login {
    export type Response =  NotVerified | Verified
}