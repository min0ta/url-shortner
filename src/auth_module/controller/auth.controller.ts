import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../service/auth.service";
import { LoginRequest, RegisterRequest, errors } from "../dto/auth.dto";
import { authErrors } from "src/auth/errors";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(@Body() body: LoginRequest, @Res() res: Response) {
        if (!validate(body)) {
            res.json({error: errors.InvalidData}).status(400).end()
            return
        }
        try {
            await this.authService.login(body, res)
            res.status(204).end()
        } catch(e) {
            if (e == authErrors.authFail) {
                res.json({error: e.message}).status(400).end()
                return
            } 
            res.status(500).json({error: errors.Unknown}).end()
        }
    } 
    @Post('logout')
    async logout(@Res() res: Response) {
        res.json(await this.authService.logout(res)).end()
    }
    @Post('register')
    async register(@Body() body: RegisterRequest, @Res() res: Response) {
        if (!validate(body)) {
            res.json({error: errors.InvalidData}).status(400).end()
            return
        }
        try {
            await this.authService.register(body, res)
            res.status(200).end()
        } catch(e) {
            if (e == authErrors.alreadyExists) {
                res.json({error: authErrors.alreadyExists.message}).status(400).end()
                return
            } 
            res.status(500).json({error: errors.Unknown}).end()
        }
    }
}

function validate(user: any) {
    if (typeof user.password != 'string'||typeof user.email != 'string') {
        return false
    }
    if (user.password.length < 3) {
        return false
    }
    return true
}