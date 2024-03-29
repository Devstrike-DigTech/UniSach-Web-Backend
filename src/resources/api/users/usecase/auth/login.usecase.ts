import Exception from "@/utils/exception/Exception";
import LoginInterface, {Login, GenerateToken} from "../../interfaces/usecases/auth/login.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";
import PasswordEncryption from "../../../../../utils/cryptography/interface/cryptography/passwordEncryption";
import { JwtGenerate } from "../../../../../utils/cryptography/interface/cryptography/jsonwebtoken/generate";
import ResendOTP from "../../interfaces/usecases/auth/resendOTP.interface";
import User from "../../interfaces/user.interface";

export default class LoginUsecase implements LoginInterface {

    constructor(private readonly UserRepo: UserRepositoryInterface,  private readonly jwtGen: JwtGenerate,  private readonly PasswordEncrypt: PasswordEncryption, private readonly resentOTP: ResendOTP){}

    public async execute(email: string, password: string, refreshToken: string): Promise<Login.Response> {
        try {
            const user = await this.UserRepo.getUserByEmail(email);

            if(!user) throw new Exception("Email or Password is incorrect", 400);

            if(user.googleID) throw new Exception("Email or Password is incorrect", 400)

            const isCorrectPassword = await this.PasswordEncrypt.verify((user as any).password, password)

            if(!isCorrectPassword) throw new Exception("Email or Password is incorrect", 400);

            if(user.emailVerificationStatus == 'pending') {
                await this.resentOTP.execute(user.email)
                return {
                    email: user.email,
                    message: "Please verify your email to continue your Registration process"
                }
            }

            

           const newRefreshTokenArray = !refreshToken ? user.refreshToken : user.refreshToken?.filter((rt: string) => rt != refreshToken) 
           
           const {accessToken, newRefreshToken} = await this.generateTokens((user as any).id)
           
           newRefreshTokenArray?.push(newRefreshToken)
           await this.UserRepo.findOneAndUpdate({_id: (user as any).id}, {refreshToken: newRefreshTokenArray, active: true})
            
            this.removeUnwantedFields(user)

            return {
                user: {...JSON.parse(JSON.stringify(user)), refreshToken: undefined, active: true},
                accessToken,
                refreshToken: newRefreshToken
            }

        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async generateTokens(id: string): Promise<GenerateToken.Response> {
        const accessToken = await this.jwtGen.sign(id, String(process.env.ACCESS_TOKEN_SECRET), String(process.env.ACCESS_TOKEN_EXPIRES_IN))
        const newRefreshToken = await this.jwtGen.sign(id, String(process.env.REFRESH_TOKEN_SECRET), String(process.env.REFRESH_TOKEN_EXPIRES_IN))

        return {accessToken, newRefreshToken}
    }   
    
    public removeUnwantedFields(user: User) {
        user.password = undefined;
        user.verificationCode = undefined
        user.confirmationCodeExpiresIn = undefined
        user.passwordResetTokenExpiresIn = undefined
        user.passwordResetToken = undefined
        // user.refreshToken = undefined
    }
}

