import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { TestService } from "../service/test.service";
import { Request, Response } from "express";
import { auth } from "src/auth/auth";


@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) {}
    @Get(':id')
    async read(@Param('id') id :string, @Req() request: Request, @Res() res: Response) {
        
        const id2 = await auth.AuthCheck(request)

     
        res.end(`id:${id2}`)
    } 
}