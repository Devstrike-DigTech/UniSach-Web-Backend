import UserRepository from "../repository";
import SignupUsecase from "../usecase/signup.usecase";
import Exception from "@/utils/exception/Exception";
import User from "../interfaces/user.interface";
import { BcryptAdapter } from "../../../../utils/cryptography/passwordEncryption";
import { JwtAdapter } from "../../../../utils/cryptography/jwtEncryption";
import GoogleAdapter from "./googleAdapter";
import SignupWithGoogleUsecase  from '../usecase/signin.google.usecase'
import {Signup} from "../interfaces/usecases/signup.google.interface";
import Email from "../../email";
import VerifyOTPUsecase from "../usecase/verifyOTP.usecase";
import ResendOTPUsecase from "../usecase/resendOTP.usecase";
import ForgotPasswordUsecase from "../usecase/forgotPassword.usecase";
import PasswordResetUsecase from "../usecase/passwordReset.usecase";
import LoginUsecase from "../usecase/login.usecase";
import { VerifyOTP } from "../interfaces/usecases/verifyOTP.interface";
import { Login } from "../interfaces/usecases/login.interface";

export default class UserBootstrap  {
    private SignupUsecase;
    private GoogleAdapter;
    private SignupWithGoogleUsecase;
    private VerifyOTPUsecase;
    private ResendOTPUsecase;
    private ForgotPasswordUsecase;
    private PasswordResetUsecase;
    private LoginUsecase


    constructor() {
        const userRepository = new UserRepository()
        const email = new Email()
        const jwtAdapter = new JwtAdapter()
        const bcryptAdapter = new BcryptAdapter(12)
        this.SignupUsecase = new SignupUsecase(userRepository, bcryptAdapter, email )
        this.SignupWithGoogleUsecase = new SignupWithGoogleUsecase(userRepository, jwtAdapter, email)
        this.VerifyOTPUsecase = new VerifyOTPUsecase(userRepository, jwtAdapter,email)
        this.ResendOTPUsecase = new ResendOTPUsecase(userRepository, email)
        this.ForgotPasswordUsecase = new ForgotPasswordUsecase(userRepository, email)
        this.PasswordResetUsecase = new PasswordResetUsecase(userRepository)
        this.LoginUsecase = new LoginUsecase(userRepository, jwtAdapter, bcryptAdapter, this.ResendOTPUsecase)
        this.GoogleAdapter = GoogleAdapter
    }

    public signup = async (data: User): Promise<string> => {
        try {
            const {first_name, last_name, email, password, role} = data
            const user = await this.SignupUsecase.execute((first_name as string), (last_name as string), email, (password as string), role)
            return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public googleAuth = async(token: string, role: string): Promise<Signup.Response> => {
        try {
            const ticket = await this.GoogleAdapter.verify(token)
        if(!ticket) throw new Exception("there was an error signing in.", 400)
        const user = await this.SignupWithGoogleUsecase.execute((ticket.given_name as string), (ticket.family_name as string) , (ticket.email as string), ticket.sub, role)
        return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public login = async (email: string, password: string): Promise<Login.Response> => {
        try {
            const data = await this.LoginUsecase.execute(email, password);

            return data;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public verifyOTP = async (email: string, OTP: string) : Promise<VerifyOTP.Response> => {
        try {
            const data = await this.VerifyOTPUsecase.execute(email, OTP)

            return data
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public resendOTP = async (email: string) : Promise<string> => {
        try {
            const message = await this.ResendOTPUsecase.execute(email)

            return message
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public forgotPassword = async (email: string): Promise<string> => {
        try {
            const message = await this.ForgotPasswordUsecase.execute(email);

            return message;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public passwordReset = async (token: string, password: string): Promise<string> => {
        try {
            const message = await this.PasswordResetUsecase.execute(token, password);

            return message;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}