import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
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
    public statusBar: StatusBar, public userService: UsersProvider, private storage: Storage) {

      this.retrieveBreedList();
    }

    ionViewDidLoad() {}

    login(){
      this.navCtrl.push('LoginPage');
    }

    retrieveBreedList() {
      this.statusBar.show();

      this.userService
      .authenticateUser(ENV.VALIDATE_EMAIL_USER, ENV.VALIDATE_EMAIL_PASS)
      .subscribe(response => {

        const headers = this.utilService.setAuthHeaders(response);
        this.utilService.getBreeds(headers)
        .subscribe(breedResponse => {
          const breedList = JSON.parse(breedResponse['_body']);
           this.storage.set('breeds', breedList);

          this.statusBar.hide();
        }, error => console.log(error));
      }, error => console.log(error));
    }
  }
