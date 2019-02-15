import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment as ENV } from '../../environments/environment';
import { StorageUtilities } from '../../providers/utility/storage';
import { Message } from '../../models/message';

@Injectable()
export class Messages {
  authHeaders: any;

  constructor(public http: Http, private utils: StorageUtilities) {
      this.utils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });
  }

  retrieveMessagesForInbox(matchProfileId) {
    const getMessagesUrl = `${ENV.BASE_URL}/message/recent?matchProfileId=${matchProfileId}`;
    console.log('Retrieving messages for matchProfile at ' + getMessagesUrl);
    return this.http.get(getMessagesUrl, {headers: this.authHeaders});
  }

  sendMessage(fromProfile: any, toProfile: any, message: string, timestamp: string) {
    let requestBody = JSON.stringify({
      matchProfileReceiver: toProfile,
      matchProfileSender: fromProfile,
      message: message,
      timestamp: timestamp
    });

    const sendMessageUrl =
    `${ENV.BASE_URL}/message?sendFrom=${fromProfile['id']}&sendTo=${toProfile['id']}`;

    console.log('Sending message ' + sendMessageUrl);
    return this.http.post(sendMessageUrl, requestBody, { headers: this.authHeaders });
  }

  deleteMessagesForMatchProfile(matchProfileId: number) {
    const url = `${ENV.BASE_URL}/message/matchProfile/${matchProfileId}`;
    console.log(url);

    return this.http.delete(url, { headers: this.authHeaders });
  }

  deleteMessageHistory(matchProfileId1: number, matchProfileId2: number) {
    const url = `${ENV.BASE_URL}/message?matchProfileId1=${matchProfileId1}&matchProfileId2=${matchProfileId2}`;
    console.log(url);

    return this.http.delete(url, { headers: this.authHeaders });
  }
}
