import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { StorageUtilities } from '../../providers';
import { MatchProfile } from '../../models/match-profile';
import { environment as ENV } from '../../environments/environment';


@Injectable()
export class MatchProfiles {
  authHeaders: any;

    constructor(public http: Http,
    private utils: StorageUtilities) {
      this.utils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });
    }

    createMatchProfile(matchProfileObj: any, userId: number) {
      const url = `${ENV.BASE_URL}/user/${userId}/matchProfile`;
      console.log("Creating match profile: " + url);

      return this.http.post(url, matchProfileObj, { headers: this.authHeaders });
    }

    updateMatchProfile(matchProfileObj: any, userId: number) {
      const url = `${ENV.BASE_URL}/user/${userId}/matchProfile/${matchProfileObj['id']}`;
      console.log("Updating match profile: " + url);

      return this.http.put(url, matchProfileObj, { headers: this.authHeaders });
    }

    deleteMatchProfileById(userId: number, matchProfileId: number) {
      const url = `${ENV.BASE_URL}/user/${userId}/matchProfile/${matchProfileId}`;
      console.log("Deleting match profile:" + url);

      return this.http.delete(url, { headers: this.authHeaders });
    }

    deleteAllMatchProfilesByUserId(userId: number) {
      const url = `${ENV.BASE_URL}/matchProfile?userId=${userId}`;
      console.log("Deleting all match profiles for user:" + url);

      return this.http.delete(url, { headers: this.authHeaders });
    }

    getMatchProfilesByUserId(userProfileId: number){
      const url = `${ENV.BASE_URL}/user/${userProfileId}/matchProfile`;

      console.log("Retrieving match profiles for user: " + url);
      return this.http.get(
        url, { headers: this.authHeaders });
    }

    getMatchProfileByMatchProfileId(matchProfileId: number) {
      const matchProfileByIdUrl =
      `${ENV.BASE_URL}/matchProfile?matchProfileId=${matchProfileId}`;
      console.log(matchProfileByIdUrl);
      return this.http.get(matchProfileByIdUrl, { headers: this.authHeaders });
    }

    // getMatchProfileByIds(matchProfileId: number, userId: number) {
    //   const matchProfileByIdUrl =
    //   `${ENV.BASE_URL}/user/${userId}/matchProfile/${matchProfileId}`;
    //   console.log(matchProfileByIdUrl);
    //   return this.http.get(matchProfileByIdUrl, { headers: this.authHeaders });
    // }

    deleteImageUpload(userProfileId: number, matchProfileId: number) {
      const url =
      `${ENV.BASE_URL}/user/${userProfileId}/matchProfile/${matchProfileId}/upload`;
      console.log('deleting uploaded image: ' + url);
      return this.http.delete(url, { headers: this.authHeaders });
    }

    insertMatchPreference(matchProfileId: number, matchPreference: any) {
      const url =
      `${ENV.BASE_URL}/matchProfile/${matchProfileId}/matchPreference`;
      console.log('adding match preference: ' + url);
      return this.http.post(url, matchPreference, { headers: this.authHeaders });
    }

}
