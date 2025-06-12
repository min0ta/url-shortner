import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { AnalyticsService } from "../service/analytics.service";
import { Errors } from "../dto/analytics.dto";


@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}
    @Get(':shortCode')
    async getAnalytics(@Param('shortCode') shortCode: string, @Res() res: Response) {  
        try {
            const result = await this.analyticsService.getAnalytics(shortCode)
            res.json(result).status(200).end()
        } catch (e) {
            if (e.message == Errors.NoAnalyticsYet) {
                res.json({error:Errors.NoAnalyticsYet}).status(400).end()
                return
            }
            res.json({error:Errors.Unknown}).status(500).end()
        }
    } 
}