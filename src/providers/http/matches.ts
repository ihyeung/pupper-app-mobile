import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class MatchesProvider {
  authHeaders: any;

  constructor(public http: Http, public globalVars: GlobalVarsProvider) {
    if (null != this.globalVars.getAuthHeaders()) {
      this.authHeaders = this.globalVars.getAuthHeaders();
    } else {
      console.log('Auth headers are null');
    }
  }

  getMatchesByMatchProfileId(matchProfileId) {
    const getMatchesUrl = ENV.BASE_URL + '/matches?matchProfileId=' + matchProfileId;
    console.log('Retrieving matches for matchProfile at ' + getMatchesUrl);
    return this.http.get(getMatchesUrl, {headers: this.authHeaders});
  }

}
