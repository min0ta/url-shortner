import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { db } from "src/db/db";
import { Errors } from "../dto/analytics.dto";

@Injectable()
export class AnalyticsService {
    async trackClick(url_id: number, referer: string, user_agent: string, ip: string) {
        const ipHash = createHash('sha256').update(ip).digest('hex');
        db.insertClick(url_id, referer, user_agent, ipHash)
    }
    async getAnalytics(short_code: string) {
        const result = await db.getClicks(short_code)
        if (result.length == 0) {
            throw new Error(Errors.NoAnalyticsYet)
        }
        return result
    }
}


