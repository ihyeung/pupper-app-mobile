import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class MatchProfilesProvider {
  authHeaders: any;

    constructor(public http: Http, public globalVars: GlobalVarsProvider) {
      if (null != this.globalVars.getAuthHeaders()) {
        this.authHeaders = this.globalVars.getAuthHeaders();
      }
    }

    createMatchProfile(matchProfileObj) {

    }

    updateMatchProfile(matchProfileObj) {

    }

    retrieveBreedList() {
      return this.http.get(ENV.BASE_URL + '/breed',
        { headers: this.globalVars.getAuthHeaders() });
    }

    getMatchProfiles(){
      const userProfileId = this.globalVars.getUserProfileObj()['id'];
      const getMatchProfilesForUserUrl = ENV.BASE_URL + '/user/' + userProfileId + '/matchProfile';

      console.log('Url to retrieve match profiles for user: ' + getMatchProfilesForUserUrl);

      return this.http.get(
        getMatchProfilesForUserUrl, { headers: this.authHeaders })
    }

    uploadImage(userProfileId, matchProfileId, file){

    }

}
