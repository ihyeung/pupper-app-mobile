import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVars, Utilities } from '../../providers';
import { environment as ENV } from '../../environments/environment';
import { User } from '../../models/user';

@Injectable()
export class Users {
  basicHeaders: any;
  authHeaders: any;

  constructor(public http: Http, public globalVars: GlobalVars,
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
      return this.http.post(loginUrl, loginData, { headers: this.basicHeaders });
    }

    /*
    THIS ENDPOINT NEEDS TO BE IMPLEMENTED ON THE BACKEND!
    */
    getUserAccountByEmail(username, headers) {
      const getUserAccountByEmailUrl = `${ENV.BASE_URL}/account?email=${username}`;
      this.authHeaders = headers;
      // if (!this.authHeaders) {
      //   this.authenticateUser(ENV.VALIDATE_EMAIL_USER, ENV.VALIDATE_EMAIL_PASS)
      //   .subscribe(response => {
      //     this.utilService.extractAndStoreAuthHeaders(response);
      //
      //     this.utilService.getAuthHeadersFromStorage().then(val => {
      //       this.authHeaders = this.utilService.createHeadersObjFromAuth(val);
      //
      //       return this.http.get(getUserAccountByEmailUrl, { headers: this.authHeaders });
      //
      //     });
      //
      //   }, err => console.error('ERROR', err));
      // } else {
        return this.http.get(getUserAccountByEmailUrl, { headers: headers });
      // }
    }

    updateUserAccount(userAccount: any, headers: any) {

    }

    getUserProfile(userProfileId: number) {

    }

    getUserProfileByEmail(userEmail: string, headers: any) {
      const retrieveUserProfileUrl = `${ENV.BASE_URL}/user?email=${userEmail}`;

      this.authHeaders = headers;

      return this.http.get(retrieveUserProfileUrl, { headers: headers });
    }

    createUserProfile(userProfileObj, authHeaders) {
        const createUserProfileUrl = `${ENV.BASE_URL}/user`;
        console.log('Creating a new user profile: ' + createUserProfileUrl);

        return this.http.post(createUserProfileUrl, userProfileObj,
          { headers: authHeaders });
      }

      updateUserProfile(userProfileObj) {

      }

      updateLastLogin(userProfileObj, date) {
        const updateLastLoginUrlString = ENV.BASE_URL +
        "/user/" + userProfileObj['id'] + "?lastLogin=" + date;

        return this.http.put(updateLastLoginUrlString, userProfileObj,
          { headers: this.authHeaders });
        }

        uploadImage(userProfileId, file){

        }

        deleteUser(userProfileObj) {
          //TODO: 2 calls to delete user account and delete user profile endpoints
        }

      }
