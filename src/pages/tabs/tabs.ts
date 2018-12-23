import { Component } from '@angular/core';

import { MessagingPage } from '../messaging/messaging';
import { MatchingPage } from '../matching/matching';
import { SettingsPage } from '../settings/settings';
import { NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalvarsProvider } from '../../providers/globalvars/globalvars';
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

  constructor(public navParams: NavParams, public http: Http, public globalVarsProvider: GlobalvarsProvider,
    private toastCtrl: ToastController) {
    this.findUserProfileById();
  }

  findUserProfileById() {
    const getUserProfileUrl = ENV.BASE_URL + '/user/' + this.globalVarsProvider.getUserId();
    console.log('Retrieving user profile url : ' + getUserProfileUrl);
    this.http.get(getUserProfileUrl,
      { headers: this.globalVarsProvider.getHeadersWithAuthToken() })
      .subscribe(resp => {
        if (resp['status'] == 403) {
          this.presentToast("Your session has expired. Please log in again.");
          return;
        }
        else if (resp['status'] == 400 || resp['status'] == 404 || resp['status'] == 422) {
          this.presentToast("Error loading User Profile data.");
          return;
        }
        else if (resp['status'] == 200) {
          const jsonResponseObj = JSON.parse((resp['_body']));
          const userProfileObj = jsonResponseObj['userProfiles'][0];

        }
      }, error => console.log(error)
      );
  }

  getMatchProfilesByUserZip(userZipCode){
    const getMatchProfileByUserZipUrl = ENV.BASE_URL + '/matchProfile?zip=' + userZipCode;
    this.http.get(getMatchProfileByUserZipUrl,
      { headers: this.globalVarsProvider.getHeadersWithAuthToken() })
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
          let matchProfileObj = jsonResponseObj['matchProfiles'][0];
          this.globalVarsProvider.setMatchProfileObj(matchProfileObj);
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
