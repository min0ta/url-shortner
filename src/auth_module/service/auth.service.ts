import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { auth } from "src/auth/auth";
import { authErrors } from "src/auth/errors";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../dto/auth.dto";
import { User } from "src/db/models";

const invalidDataError = 'invalid data'

@Injectable()
export class AuthService {
    async login(body: LoginRequest, res: Response)  {
        const user = {
            id: 0,
            email: body.email,
            password: body.password
        }
        await auth.Login(user, res)
    }
    async logout(res: Response) {
        await auth.LogOut(res)
        return {}
    }
    async register(body: RegisterRequest, res: Response) {
        const userToRegister = {
            id: 0,
            email: body.email,
            password: body.password
        }
        try {
            await auth.Register(userToRegister)
            await auth.Login({
                ...userToRegister,
                password: body.password
            }, res)
        } catch (e) {
            throw e
        }
    }
}


// function validate(user: User) {
//     if (typeof user.id != 'number' || user.id < 0) {
//         return false
//     }
//     if (typeof user.password != 'string'||typeof user.email != 'string') {
//         return false
//     }
//     if (user.password.length < 3) {
//         return false
//     }
//     return true
// }