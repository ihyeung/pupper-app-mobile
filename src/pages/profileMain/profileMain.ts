import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UsersProvider } from '../../providers/http/userProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { CreateMatchProfilePage } from '../../pages/createMatchProfile/createMatchProfile';

@Component({
  selector: 'page-profileMain',
  templateUrl: 'profileMain.html',
})
export class ProfileMainPage {

  constructor(public navCtrl: NavController, public globalVars: GlobalVarsProvider,
  public utilService: UtilityProvider, public matchProfService: MatchProfilesProvider,
  public userService: UsersProvider) {
    console.log('profile main page constructor');
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
          this.globalVars.setMatchProfileObj(matchProfileObj);
        } else {
          this.utilService.presentDismissableToast("Please create a matching profile to get started.");
          this.navCtrl.push(CreateMatchProfilePage);
        }
      }
    }, error => console.log(error)
    );
}

}
