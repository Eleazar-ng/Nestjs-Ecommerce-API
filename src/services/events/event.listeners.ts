import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { EVENT_NAMES } from './event.name.constants';

@Injectable()
export class EventListeners {
  constructor() {}

  @OnEvent(EVENT_NAMES.CREATE_NEW_USER)
  async handleCreateNewUserEvent(payload: any) {
    console.log("****Sending verification email to new user*****")
  }

  @OnEvent(EVENT_NAMES.LOGIN_USER)
  async handleUserLoginEvent(payload: any) {
    console.log("****Logged In User*****")
  }
}
