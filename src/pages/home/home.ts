import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { UtilityProvider } from '../../providers/utility/utilities';
import { StatusBar } from '@ionic-native/status-bar';
import { environment as ENV } from '../../environments/environment';
import { UsersProvider } from '../../providers/http/userProfiles';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  
  breedList: any;

  constructor(public navCtrl: NavController, public utilService: UtilityProvider,
    public statusBar: StatusBar, public userService: UsersProvider,
    public globalVars: GlobalVarsProvider) {

      this.retrieveBreedList();
    }

    ionViewDidLoad() {}

    login(){
      this.globalVars.setBreedData(this.breedList);
      this.navCtrl.push('LoginPage');
    }

    signup() {
      this.navCtrl.push('SignupPage', { breedList: this.breedList });
    }

    retrieveBreedList() {
      this.statusBar.show();

      this.userService
      .authenticateUser(ENV.VALIDATE_EMAIL_USER, ENV.VALIDATE_EMAIL_PASS)
      .subscribe(response => {

        const headers = this.utilService.setAuthHeaders(response);
        this.utilService.getBreeds(headers)
        .subscribe(breedResponse => {
          this.breedList = JSON.parse(breedResponse['_body']);

          this.statusBar.hide();
        }, error => console.log(error));
      }, error => console.log(error));
    }
  }
