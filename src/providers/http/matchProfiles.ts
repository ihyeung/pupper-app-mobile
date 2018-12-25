import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class MatchProfilesProvider {
  authHeaders: any;

    constructor(public http: Http, public globalVarsProvider: GlobalVarsProvider) {
      if (null != this.globalVarsProvider.getAuthHeaders()) {
        this.authHeaders = this.globalVarsProvider.getAuthHeaders();
      }
    }

    createMatchProfile(matchProfileObj) {

    }

    updateMatchProfile(matchProfileObj) {

    }

    getMatchProfiles(userProfileId){

    }

    uploadImage(userProfileId, matchProfileId, file){

    }

}
