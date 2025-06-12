import { Injectable } from "@nestjs/common";

@Injectable()
export class TestService {
    readTest(id:string): string {
        return `heello ${id}`
    }
}