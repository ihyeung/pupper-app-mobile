import { Component } from '@angular/core';
import { MessagingPage } from '../messaging/messaging';
import { MatchingPage } from '../matching/matching';
import { SettingsPage } from '../settings/settings';
import { ProfileMainPage } from '../profileMain/profileMain';
// import { NavParams, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';
import { environment as ENV } from '../../environments/environment';

@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs',

})
export class TabsPage {

  tabRootProfile = ProfileMainPage;
  tabRootSettings = SettingsPage;
  tabRootMatching = MatchingPage;
  tabRootMessaging = MessagingPage;

  constructor(public http: Http, public globalVarsProvider: GlobalVarsProvider,
    private matchProfService: MatchProfilesProvider, private utilService: UtilityProvider) {
      if (null == this.globalVarsProvider.getUserProfileObj()) {
        console.log('Error: cannot retrieve user profile data from global vars');
      } else {
        console.log('Now retreiving match profiles for the currently logged in user');
        this.retrieveMatchProfilesForUser(this.globalVarsProvider.getUserProfileObj()['id']);
      }
  }

  retrieveMatchProfilesForUser(userProfileId){
    const getMatchProfilesForUserUrl = ENV.BASE_URL + '/user/' + userProfileId + '/matchProfile';
    console.log('Url to retrieve match profiles for user: ' + getMatchProfilesForUserUrl);
    this.http.get(getMatchProfilesForUserUrl,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(resp => {
        if (resp['status'] == 403) {
          this.utilService.presentDismissableToast("Your session has expired. Please log in again.");
          return;
        }
        else if (resp['status'] == 400 || resp['status'] == 404 || resp['status'] == 422) {
          this.utilService.presentAutoDismissToast("Error loading Match Profile data.");
          return;
        }
        else if (resp['status'] == 200) {
          let jsonResponseObj = JSON.parse((resp['_body']));

          //Check to see whether user has previously created match profiles
          if (null != jsonResponseObj['matchProfiles']) {
            let matchProfileObj = jsonResponseObj['matchProfiles'][0];
            //Store the match profile object for the currently logged in user
            this.globalVarsProvider.setMatchProfileObj(matchProfileObj);
          }
        }
      }, error => console.log(error)
      );
  }

}
