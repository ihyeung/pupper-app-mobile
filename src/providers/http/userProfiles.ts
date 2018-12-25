import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class UsersProvider {
    basicHeaders: any;

    constructor(public http: Http) {
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

    createUserProfile(userProfileObj) {

    }

    updateUserProfile(userProfileObj) {

    }

    updateLastLogin(userProfileId) {

    }

    deleteUser(userProfileObj) {
      //TODO: 2 calls to delete user account and delete user profile endpoints
    }

}
