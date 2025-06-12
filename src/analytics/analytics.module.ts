import { Module } from "@nestjs/common";
import { AnalyticsService } from "./service/analytics.service";
import { AnalyticsController } from "./controller/analytics.controller";


@Module({
    imports: [],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
  })
  export class AnalyticsModule {}
  