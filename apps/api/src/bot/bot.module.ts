import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
