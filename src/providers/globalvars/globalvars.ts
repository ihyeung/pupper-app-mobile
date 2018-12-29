import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVarsProvider {

  userProfileObj: any;
  authHeaders: any;
  matchProfileObj: any;
  breedData: any = [];

  constructor() {
  }

  public setUserProfileObj(value) {
    this.userProfileObj = value;
  }

  public getUserProfileObj() {
    return this.userProfileObj;
  }

  public setMatchProfileObj(value) {
    this.matchProfileObj = value;
  }

  public getMatchProfileObj() {
    return this.matchProfileObj;
  }

  public setAuthHeaders(value) {
    this.authHeaders = value;
  }

  public getAuthHeaders() {
    return this.authHeaders;
  }

  public getBreedData() {
    return this.breedData;
  }

  public setBreedData(value) {
    this.breedData = value;
  }
}
