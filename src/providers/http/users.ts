import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Utilities } from '../../providers';
import { environment as ENV } from '../../environments/environment';
import { User } from '../../models/user';

@Injectable()
export class Users {
  basicHeaders: any;
  authHeaders: any;

  constructor(public http: Http,
    public utilService: Utilities) {
      this.basicHeaders = new Headers({ 'Content-Type': 'application/json' });
    }

    createUserAccount(username, password) {
      let signupData = JSON.stringify({
        username: username,
        password: password
      });

      const registerUrl = `${ENV.BASE_URL}/account/register`;

      return this.http.post(registerUrl, signupData, { headers: this.basicHeaders });
    }

    authenticateUser(username, password) {
      let loginData = JSON.stringify({
        username: username,
        password: password
      });

      const loginUrl = `${ENV.BASE_URL}/login`;
      console.log(loginUrl);
      return this.http.post(loginUrl, loginData, { headers: this.basicHeaders });
    }

    getUserAccountByEmail(username, headers) {
      const getUserAccountByEmailUrl = `${ENV.BASE_URL}/account?email=${username}`;
      console.log(getUserAccountByEmailUrl);
      return this.http.get(getUserAccountByEmailUrl, { headers: this.authHeaders });
    }

    updateUserAccount(userAccount: any) {
      const email = userAccount['username'];
      const url = `${ENV.BASE_URL}/account?email=${email}`;
      console.log(url);
      return this.http.put(url, userAccount, { headers: this.authHeaders });
    }

    getUserProfile(userProfileId: number, headers: any) {
      const url = `${ENV.BASE_URL}/user/${userProfileId}`;
      console.log(url);

      this.authHeaders = headers;

      return this.http.get(url, { headers: this.authHeaders });
    }

    getUserProfileByEmail(userEmail: string, headers: any) {
      const retrieveUserProfileUrl = `${ENV.BASE_URL}/user?email=${userEmail}`;
      console.log(retrieveUserProfileUrl);

      this.authHeaders = headers;

      return this.http.get(retrieveUserProfileUrl, { headers: this.authHeaders });
    }

    createUserProfile(userProfileObj, authHeaders) {
      this.authHeaders = authHeaders;
      const createUserProfileUrl = `${ENV.BASE_URL}/user`;
      console.log('Creating a new user profile: ' + createUserProfileUrl);

      return this.http.post(createUserProfileUrl, userProfileObj,
          { headers: authHeaders });
    }

    updateUserProfile(userProfileObj) {
      const url = `${ENV.BASE_URL}/user`;
      console.log('Updating user profile: ' + url);

      return this.http.post(url, userProfileObj, { headers: this.authHeaders });
    }

    updateLastLogin(userProfileObj, date) {
        const updateLastLoginUrlString = ENV.BASE_URL +
        "/user/" + userProfileObj['id'] + "?lastLogin=" + date;

        console.log('updating last login: ' + updateLastLoginUrlString);
        return this.http.put(updateLastLoginUrlString, userProfileObj,
          { headers: this.authHeaders });
    }

    uploadImage(userProfileId: number, file: File){
    }

    deleteUserAccount(email: string) {
      const url = `${ENV.BASE_URL}/account?email=${email}`;
      console.log(url);
      return this.http.delete(url, { headers: this.authHeaders });
    }

    deleteUserProfile(email: string) {
      const url = `${ENV.BASE_URL}/user?email=${email}`;
      return this.http.delete(url, { headers: this.authHeaders });
    }

}
