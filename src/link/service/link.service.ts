import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import { auth } from 'src/auth/auth';
import { db } from 'src/db/db';
import { errors } from '../dto/link.dto';

@Injectable()
export class LinkService {
    async createLink(original_url: string, req: Request) {
        const id = auth.AuthCheck(req)
        if (id === 0) {
            throw new Error(errors.Unauth)
        }
        const short_url = this.getShortCode()
        try { 
            const res = await db.insertLink(original_url, short_url, id)
            return short_url
        } catch (e) {
            console.log(e)
            throw new Error(errors.Unknown)
        }
    }
    async getLink(short_url: string) {
        try { 
            const res = await db.getLink(short_url)
            return res
        } catch(e) {
            throw new Error(errors.NoSuchLink)
        }
    }

    async getAllLinks(req: Request) {
        const id = auth.AuthCheck(req);
        if (id == 0) {
            throw new Error(errors.Unauth)
        }
        return await db.getAllLinks(id);
    }

    private getShortCode(): string {
        return randomBytes(8).toString('base64url').substring(0, 10);
    }
}
