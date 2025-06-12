import { Module } from "@nestjs/common";
import { LinkController } from "./controller/link.controller";
import { LinkService } from "./service/link.service";
import { AnalyticsService } from "src/analytics/service/analytics.service";

@Module({
    imports: [],
    controllers: [LinkController],
    providers: [LinkService, AnalyticsService],
  })
  export class LinkModule {}
