import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventService } from './event.service';
import { EventListeners } from './event.listeners';

@Module({
  providers: [EventService, EventListeners],
  exports: [EventService],
})
export class EventModule {}