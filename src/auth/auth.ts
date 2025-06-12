import { Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { config } from "src/config/config";
import { db } from "src/db/db";
import { User } from "src/db/models";
import { authErrors } from "./errors";
const authCookieName = "auth-cookie"
//TODO: add additional salt to each password (`${password}${salt}`)
class Authorization {

    private createJWTCookie(res: Response, id: number) {
        const signedString = jwt.sign({id:`${id}`}, config.JWT_SIGING_KEY, {
            expiresIn: config.JWT_EXPIRES*1000
        })
        res.cookie(authCookieName, signedString, {
            sameSite: 'strict',
            httpOnly: true,
            maxAge: config.JWT_EXPIRES*1000,
            secure: true,
        })
    }

    AuthCheck(req: Request) {
        const token = req.cookies[authCookieName]
        if (token == null) {
            return 0;
        }
        try {
            const id = jwt.verify(token, config.JWT_SIGING_KEY) as jwt.JwtPayload
            return id.id
        }
        catch(e) {
            return 0
        }
    }

    async Login(queryUser: User, res: Response) {
        const query = await db.getUserByEmail(queryUser.email)  
        if (query == 0) {
            throw authErrors.authFail
        }

        const actualUser = query
        if (!await bcrypt.compare(queryUser.password, actualUser.password)) {
            throw authErrors.authFail
        }

        this.createJWTCookie(res, actualUser.id)
    }

    async Register(user: User) {
        const alreadyRegistered = await db.getUserByEmail(user.email)
        if (alreadyRegistered !== 0) {
            throw authErrors.alreadyExists
        }
        // add server-side salt
        const hash = await bcrypt.hash(user.password, 10)
        user.password = hash
        const id = await db.createUser(user)
        user.id = id
        return user;
    }

    async LogOut(res: Response) {
        res.cookie(authCookieName, "", {
            sameSite: 'strict',
            httpOnly: true,
            maxAge: -1,
            secure: true
        })
    }
}   


export const auth = new Authorization()