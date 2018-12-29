import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UsersProvider } from '../../providers/http/userProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';

@IonicPage()
@Component({
  selector: 'page-profileMain',
  templateUrl: 'profileMain.html',
})
export class ProfileMainPage {

  constructor(public navCtrl: NavController, public globalVars: GlobalVarsProvider,
  public utilService: UtilityProvider, public matchProfService: MatchProfilesProvider,
  public userService: UsersProvider) {
    if (null == this.globalVars.getUserProfileObj()) {
      console.log('Error: cannot retrieve user profile data from global vars');
    } else {
      console.log('retrieving match profiles for user');

      this.retrieveMatchProfilesForUser();
    }
}

retrieveMatchProfilesForUser(){
  this.matchProfService.getMatchProfiles()
    .subscribe(resp => {
      if (resp['status'] == 200) {
        let jsonResponseObj = JSON.parse((resp['_body']));
        //Check to see whether user has previously created match profiles
        if (null != jsonResponseObj['matchProfiles']) {
          let matchProfileObj = jsonResponseObj['matchProfiles'][0];
          //Store the match profile object for the currently logged in user
          this.globalVars.setMatchProfileObj(matchProfileObj);
        } else {
          this.utilService.presentDismissableToast("Please create a matching profile to get started.");
          this.navCtrl.push('CreateMatchProfilePage');
        }
      }
    }, error => console.log(error));
}

}
