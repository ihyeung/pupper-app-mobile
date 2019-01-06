import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Utilities } from '../../providers';
import { MatchProfile } from '../../models/match-profile';
import { environment as ENV } from '../../environments/environment';


@Injectable()
export class MatchProfiles {
  authHeaders: any;

    constructor(public http: Http,
    private utilService: Utilities, private loadCtrl: LoadingController) {
      this.utilService.getAuthHeaders().then(val => {
        this.authHeaders = val;
      });
    }

    createMatchProfile(matchProfileObj: any, userId: number) {
      const url = `${ENV.BASE_URL}/user/${userId}/matchProfile`;
      console.log("Creating match profile: " + url);

      return this.http.post(url, matchProfileObj, { headers: this.authHeaders });
    }

    updateMatchProfile(matchProfileObj: any, userId: number) {
      const url = `${ENV.BASE_URL}/user/${userId}/matchProfile`;
      console.log("Creating match profile: " + url);

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

    getMatchProfiles(userProfileObj: any){
      const userProfileId = userProfileObj['id'];
      const getMatchProfilesForUserUrl =
      `${ENV.BASE_URL}/user/${userProfileId}/matchProfile`;

      console.log("Retrieving match profiles for user: " + getMatchProfilesForUserUrl);
      return this.http.get(
        getMatchProfilesForUserUrl, { headers: this.authHeaders });
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

    uploadImage(userProfileId: number, matchProfileId: number, file: File) {
      let formData = new FormData();
      // formData.append('profilePic', imageFile, fileName);
      formData.append('profilePic', file);


      const formheadersWithAuth = new Headers({
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        'Authorization': this.authHeaders.get('Authorization')
      });
      const url =
      `${ENV.BASE_URL}/user/${userProfileId}/matchProfile/${matchProfileId}/upload`;
      console.log('uploading image: ' + url);

      return this.http.put(url, formData, { headers: formheadersWithAuth });
    }

    deleteImageUpload(userProfileId: number, matchProfileId: number) {
      const url =
      `${ENV.BASE_URL}/user/${userProfileId}/matchProfile/${matchProfileId}/upload`;
      console.log('deleting uploaded image: ' + url);
      return this.http.delete(url, { headers: this.authHeaders });
    }

}
