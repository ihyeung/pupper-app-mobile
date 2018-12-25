import { Component } from '@angular/core';

import { MessagingPage } from '../messaging/messaging';
import { MatchingPage } from '../matching/matching';
import { SettingsPage } from '../settings/settings';
import { NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { ToastController } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SettingsPage;
  tab2Root = MatchingPage;
  tab3Root = MessagingPage;
  zip: any;

  constructor(public navParams: NavParams, public http: Http, public globalVarsProvider: GlobalVarsProvider,
    private toastCtrl: ToastController) {
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
          this.presentToast("Your session has expired. Please log in again.");
          return;
        }
        else if (resp['status'] == 400 || resp['status'] == 404 || resp['status'] == 422) {
          this.presentToast("Error loading Match Profile data.");
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

  presentToast(msgToDisplay) {
    let toast = this.toastCtrl.create({
      message: msgToDisplay,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }

}
