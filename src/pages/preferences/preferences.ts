import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { MatchProfiles, StorageUtilities } from "../../providers";


@IonicPage()
@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html',
})
export class PreferencesPage {
  
  matchPreferences: any = []; //match preferences for default match profile
  matchProfileObj: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageUtilities,
              private dialog: Dialogs, private matchProfiles: MatchProfiles) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreferencesPage');
    this.retrieveDataFromStorage();
  }

  retrieveDataFromStorage() {
    this.storage.getDataFromStorage('preferences').then(val => {
      if (!val) {
        console.log("No matching preferences found in storage");
        if (this.matchProfileObj) {
          console.log('Making http call to retrieve matching preferences for match profile id =' + this.matchProfileObj.id);
          this.getMatchPreferencesForDefaultMatchProfile(this.matchProfileObj.id);
        }
      } else {
        this.matchPreferences = val;
      }
    });
  }


  saveMatchProfileSettings() {
    this.dialog.alert('Match Profile button clicked')
      .then(() => {
        console.log('Dialog dismissed');
      })
      .catch(e => console.log('Error displaying dialog', e));
  }


  getMatchPreferencesForDefaultMatchProfile(matchProfileId: number) {
    this.matchProfiles.getMatchProfileByMatchProfileId(matchProfileId)
      .map(res => res.json())
      .subscribe(response => {
          console.log(JSON.stringify(response));
          if (response.isSuccess) {
            this.matchPreferences = response['matchPreferences'];
            console.log(JSON.stringify(this.matchPreferences));
            this.storage.storeData('preferences', this.matchPreferences);
          }
        }
        , err => console.error('ERROR: ', JSON.stringify(err)));
  }
}
