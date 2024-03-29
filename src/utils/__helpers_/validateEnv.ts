import { cleanEnv, port, str, num, bool } from 'envalid'


function validateEnv (): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        PORT: port({default: 3000}),
        DATABASE: str(),
        DATABASE_PASSWORD: str(),
        EMAIL_USERNAME: str(),
        EMAIL_PASSWORD: str(),
        EMAIL_HOST: str(),
        EMAIL_PORT: num(),
        CLIENT_ID: str(),
        CLIENT_SECRET: str(),
        ACCESS_TOKEN_SECRET: str(),
        REFRESH_TOKEN_SECRET: str(),
        COOKIE_SECURE: bool()
    })
}

export default validateEnv