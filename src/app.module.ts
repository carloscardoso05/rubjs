import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper/scraper.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ScraperService],
})
export class AppModule {}
