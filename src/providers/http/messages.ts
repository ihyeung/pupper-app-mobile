import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../globalvars/globalvars';
import { UtilityProvider } from '../utility/utilities';
import { UsersProvider } from './userProfiles';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class MessagesProvider {
  authHeaders: any;

  constructor(public http: Http, public globalVars: GlobalVarsProvider,
    public userService: UsersProvider, public utilService: UtilityProvider) {
    if (null != this.globalVars.getAuthHeaders()) {
      this.authHeaders = this.globalVars.getAuthHeaders();
    } else {
      console.log('Auth headers are null');

    }
  }

  retrieveMessagesForInbox(matchProfileId) {
    const getMessagesUrl = ENV.BASE_URL + '/message?matchProfileId=' + matchProfileId;
    console.log('Retrieving messages for matchProfile at ' + getMessagesUrl);
    return this.http.get(getMessagesUrl, {headers: this.authHeaders});
  }
}
