import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVars, Utilities } from '../../providers';
import { MatchProfile } from '../../models/match-profile';
import { environment as ENV } from '../../environments/environment';


@Injectable()
export class MatchProfiles {
  authHeaders: any;

    constructor(public http: Http, public globalVars: GlobalVars,
    private utilService: Utilities) {
      this.utilService.getAuthHeadersFromStorage().then(val => {
        this.authHeaders = new Headers({ 'Content-Type': val['Content-Type'],
        'Authorization': val['Authorization'] });
      });
    }

    createMatchProfile(matchProfileObj) {

    }

    updateMatchProfile(matchProfileObj) {

    }

    getMatchProfiles(userProfileObj){
      const userProfileId = userProfileObj['id'];

      const getMatchProfilesForUserUrl =
      `${ENV.BASE_URL}/user/${userProfileId}/matchProfile`;

      console.log("Retrieving match profiles for user: " + getMatchProfilesForUserUrl);
      return this.http.get(
        getMatchProfilesForUserUrl, { headers: this.authHeaders });
    }

    getMatchProfileById(matchProfileId) {
      const matchProfileByIdUrl =
      `${ENV.BASE_URL}/matchProfile?matchProfileId=${matchProfileId}`;
      return this.http.get(matchProfileByIdUrl, { headers: this.authHeaders });
    }

    uploadImage(userProfileId, matchProfileId, file){

    }

}
