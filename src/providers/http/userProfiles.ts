import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UtilityProvider } from '../../providers/utility/utilities';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class UsersProvider {
  basicHeaders: any;
  authHeaders: any;

  constructor(public http: Http, public globalVars: GlobalVarsProvider,
    public utilService: UtilityProvider) {
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

    getUserAccountByEmail(username) {
      const getUserAccountByEmailUrl = ENV.BASE_URL + '/account?email=' + username;
      if (this.globalVars.getAuthHeaders() == null) {
        this.authenticateUser(ENV.VALIDATE_EMAIL_USER, ENV.VALIDATE_EMAIL_PASS)
        .subscribe(response => {
          this.utilService.setAuthHeaders(response);
          return this.http.get(getUserAccountByEmailUrl, { headers: this.globalVars.getAuthHeaders() });
          
        }, error => console.log(error)
      );
    } else {
      return this.http.get(getUserAccountByEmailUrl, { headers: this.globalVars.getAuthHeaders() });
    }
  }

  updateUserAccount(username, password) {

  }

  getUserProfile(userProfileId) {

  }

  getUserProfileByEmail(userEmail) {
    const retrieveUserProfileUrl = ENV.BASE_URL + '/user?email=' + userEmail;

    this.authHeaders = this.globalVars.getAuthHeaders();

    return this.http.get(retrieveUserProfileUrl,
      { headers: this.authHeaders });
    }

    createUserProfile(userProfileObj) {

    }

    updateUserProfile(userProfileObj) {

    }

    updateLastLogin(userProfileObj, date) {
      const updateLastLoginUrlString = ENV.BASE_URL +
      "/user/" + userProfileObj['id'] + "?lastLogin=" + date;

      return this.http.put(updateLastLoginUrlString, userProfileObj,
        { headers: this.authHeaders })
      }

      uploadImage(userProfileId, file){

      }

      deleteUser(userProfileObj) {
        //TODO: 2 calls to delete user account and delete user profile endpoints
      }

    }