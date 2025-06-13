import { Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth_module/auth.module';
import { LinkModule } from './link/link.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [TestModule, AuthModule, LinkModule, AnalyticsModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'frontend')})],
  controllers: [],
  providers: [],
})
export class AppModule {}
