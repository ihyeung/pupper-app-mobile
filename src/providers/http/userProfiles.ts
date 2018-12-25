import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class UsersProvider {
    basicHeaders: any;

    constructor(public http: Http, public globalVars: GlobalVarsProvider) {
      this.basicHeaders = new Headers({ 'Content-Type': 'application/json' });
    }

    createUserAccount(username, password) {
      let signupData = JSON.stringify({
        username: username,
        password: password
      });

      const registerUrl = ENV.BASE_URL + '/account/register';

      return this.http.post(registerUrl, signupData, { headers: this.basicHeaders });
    }

    authenticateUser(username, password) {
      let loginData = JSON.stringify({
        username: username,
        password: password
      });

      const loginUrl = ENV.BASE_URL + '/login';
      return this.http.post(loginUrl, loginData, { headers: this.basicHeaders });
    }

    updateUserAccount(username, password) {

    }

    getUserProfile(userProfileId) {

    }

    getUserProfileByEmail(userEmail) {
      const retrieveUserProfileUrl = ENV.BASE_URL + '/user?email=' + userEmail;
      console.log('endpoint: ' + retrieveUserProfileUrl);

      let headers = this.globalVars.getAuthHeaders();
      console.log('headers: ' + headers.get('Authorization'));
      console.log('headers: ' + headers.get('Content-Type'));

      return this.http.get(retrieveUserProfileUrl,
        { headers: headers });
    }

    createUserProfile(userProfileObj) {

    }

    updateUserProfile(userProfileObj) {

    }

    updateLastLogin(userProfileId) {

    }

    uploadImage(userProfileId, file){

    }

    deleteUser(userProfileObj) {
      //TODO: 2 calls to delete user account and delete user profile endpoints
    }

}
