import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalvarsProvider {

  fileToUpload: any;
  filename: any;
  userProfileObj: any;
  authHeaders: any;
  matchProfileObj: any;

  constructor(public http: HttpClient) {
  }

  public setFileToUpload(value) {
    this.fileToUpload = value;
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
}
