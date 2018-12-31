import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment as ENV } from '../../environments/environment';
import { Utilities } from '../../providers/utility/utilities';
import { Message } from '../../models/message';


@Injectable()
export class Messages {
  authHeaders: any;

  constructor(public http: Http,
    private utilService: Utilities) {
      this.utilService.getAuthHeadersFromStorage().then(val => this.authHeaders = val);
  }

  retrieveMessagesForInbox(matchProfileId) {
    const getMessagesUrl = ENV.BASE_URL + '/message?matchProfileId=' + matchProfileId;
    console.log('Retrieving messages for matchProfile at ' + getMessagesUrl);
    return this.http.get(getMessagesUrl, {headers: this.authHeaders});
  }
}
