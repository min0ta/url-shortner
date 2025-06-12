import { Body, Controller, Get, HttpCode, Param, Post, Req, Res } from "@nestjs/common";
import { LinkService } from "../service/link.service";
import { Request, Response } from "express";
import { CreateLinkRequest, errors } from "../dto/link.dto";
import { AnalyticsService } from "src/analytics/service/analytics.service";

@Controller('link')
export class LinkController {
    constructor(private readonly linkService: LinkService, private readonly analyticsService: AnalyticsService) {}
    @Get(':id')
    async getLink(@Param('id') short_url: string, @Res() res: Response, @Req() req: Request) {
        let id = 0
        try {
            const response = await this.linkService.getLink(short_url)
            res.status(300).redirect(response.original_url)
            id = response.id
        } catch (e) {
            res.json({error: errors.NoSuchLink}).status(400).end()
            return
        }
        if (id != 0) {
            try {
            await this.analyticsService.trackClick(id, 
                    req.headers['referer']??'unknown referer',
                    req.headers['user-agent']??'unknown user agent',
                    req.ip??''
            )
            } catch(e) {
                console.log(e)
            }
        }
    }
    @Get()
    async getAllLinks(@Res() res: Response, @Req() req: Request) {
        try {
            const result = await this.linkService.getAllLinks(req)
            res.json(result).status(200).end()
        } catch(e) {
            if (e.message = errors.Unauth) {
                res.json({error: errors.Unauth}).status(400).end()
                return
            }
            res.json({error: errors.Unknown}).status(500).end()
        }
    }
    @Post()
    async createLink(@Body() body: CreateLinkRequest, @Res() res: Response, @Req() req: Request) {
        if (!validateBody(body)) {
            res.json({error: errors.InvalidRequest}).status(400).end()
            return
        }
        try {
            const response = await this.linkService.createLink(body.original_url, req)
            res.json({result: response}).status(200).end()
        } catch(e) {
            if (e.message == errors.Unauth) {
                res.json({error: errors.Unauth}).status(400).end()
                return
            }
            res.json({error: errors.Unknown}).status(500).end()
        }
    }
}

function validateBody(body: CreateLinkRequest) {
    if (body == null || body.original_url == null || typeof body.original_url != 'string') {
        return false
    }
    try {
        const newUrl = new URL(body.original_url);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}