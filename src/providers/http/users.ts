import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {StorageUtilities} from '../../providers';
import {environment as ENV} from '../../environments/environment';

@Injectable()
export class Users {
  basicHeaders: any;
  authHeaders: any;

  constructor(public http: Http, public utils: StorageUtilities) {
    this.basicHeaders = new Headers({ 'Content-Type': 'application/json' });
  }

  createUserAccount(username, password) {
    let signupData = JSON.stringify({
      username: username,
      password: password
    });
    const registerUrl = `${ENV.BASE_URL}/account/register`;
    console.log(registerUrl);

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

  getUserAccountByEmail(username: string, headers: any) {
    const getUserAccountByEmailUrl = this.authEndpointWithEmailParam(username);

    this.authHeaders = headers;
    console.log(getUserAccountByEmailUrl);
    return this.http.get(getUserAccountByEmailUrl, { headers: this.authHeaders });
  }

  updateUserAccount(userAccount: any) {
    const email = userAccount['username'];
    const url = this.authEndpointWithEmailParam(email);
    console.log(url);
    return this.http.put(url, userAccount, { headers: this.authHeaders });
  }

  deleteUserAccount(email: string) {
    const url = this.authEndpointWithEmailParam(email);
    console.log(url);
    return this.http.delete(url, { headers: this.authHeaders });
  }

  getUserProfile(userProfileId: number, headers: any) {
    const url = `${ENV.BASE_URL}/user/${userProfileId}`;
    console.log(url);

    this.authHeaders = headers;

    return this.http.get(url, { headers: this.authHeaders });
  }

  getUserProfileByEmail(email: string, headers: any) {
    const url = `${ENV.BASE_URL}/user?email=${email}`;
    console.log(url);

    this.authHeaders = headers;
    return this.http.get(url, { headers: this.authHeaders });
  }

  createUserProfile(userProfileObj: any, authHeaders: any) {
    this.authHeaders = authHeaders;
    const createUserProfileUrl = `${ENV.BASE_URL}/user`;
    console.log('Creating a new user profile: ' + createUserProfileUrl);

    return this.http.post(createUserProfileUrl, userProfileObj, { headers: authHeaders });
  }

  updateUserProfileById(userProfileObj: any, userId: number) {
    const url = `${ENV.BASE_URL}/user/${userId}`;
    console.log('Updating user profile: ' + url);

    return this.http.put(url, userProfileObj, { headers: this.authHeaders });
  }

  updateLastLogin(userProfileObj: any, date: string) {
    const updateLastLoginUrlString = `${ENV.BASE_URL}/user/${userProfileObj['id']}?lastLogin=${date}`;

    console.log('updating last login: ' + updateLastLoginUrlString);
    return this.http.put(updateLastLoginUrlString, userProfileObj, { headers: this.authHeaders });
  }

  deleteUserProfileByEmail(email: string) {
    const url = `${ENV.BASE_URL}/user?email=${email}`;
    console.log(url);
    return this.http.delete(url, { headers: this.authHeaders });
  }

  deleteUserProfileByUserId(id: number) {
    const url = `${ENV.BASE_URL}/user/${id}`;
    console.log(url);
    return this.http.delete(url, { headers: this.authHeaders });
  }

  private authEndpointWithEmailParam(email: string) {
    return `${ENV.BASE_URL}/account?email=${email}`;
  }
}
