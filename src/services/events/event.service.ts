import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(private readonly eventService: EventEmitter2) {}

  async emit(name: string, payload: any) {
    this.eventService.emit(name, payload);
  }
}
