import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalvarsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalvarsProvider {

  fileToUpload: any;
  filename: any;
  userProfileId: any;
  userProfileObj: any;
  headersWithAuthToken: any;
  matchProfileObj: any;
  matchProfileId: any;

  constructor(public http: HttpClient) {
  }

  public setFileToUpload(value) {
    this.fileToUpload = value;
    console.log("Global Vars, File To Upload: " + this.fileToUpload);
  }

  public getFileToUpload() {
    return this.fileToUpload;
  }

  public setFilename(value) {
    this.filename = value;
  }

  public getFilename() {
    return this.filename;
  }

  public setUserId(value) {
    this.userProfileId = value;
  }

  public getUserId() {
    return this.userProfileId;
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

  public setMatchProfileId(value) {
    this.matchProfileId = value;
  }

  public getMatchProfileId() {
    return this.matchProfileId;
  }

  public setHeadersWithAuthToken(value) {
    this.headersWithAuthToken = value;
  }

  public getHeadersWithAuthToken() {
    return this.headersWithAuthToken;
  }
}
