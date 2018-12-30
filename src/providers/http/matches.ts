import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';
import { UtilityProvider } from '../../providers/utility/utilities';

@Injectable()
export class MatchesProvider {
  authHeaders: any;

  constructor(public http: Http, public globalVars: GlobalVarsProvider,
    private utilService: UtilityProvider) {
      utilService.getAuthHeadersFromStorage().then(val => {
        this.authHeaders = utilService.createHeadersObjFromAuth(val);
      });  }

  getMatchesByMatchProfileId(matchProfileId) {
    const getMatchesUrl = ENV.BASE_URL + '/matches?matchProfileId=' + matchProfileId;
    console.log('Retrieving matches for matchProfile at ' + getMatchesUrl);
    return this.http.get(getMatchesUrl, {headers: this.authHeaders});
  }

}
