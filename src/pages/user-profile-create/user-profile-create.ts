import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { Utilities, Users, GlobalVars } from '../../providers';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  templateUrl: 'user-profile-create.html',
  selector: 'page-user-profile-create'
})

export class CreateUserProfilePage {
  firstName: string;
  lastName: string;
  birthdate: string;
  zip: string;
  maritalStatus: any;
  sex: any;
  minDate: string;
  maxDate: string;
  imageFilePath: string;
  imageFileName: string;
  userAccount: any;
  userProfileFormData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public globalVars: GlobalVars,
    public utilService: Utilities,
    public userService: Users,
    private storage: Storage) {

      this.imageFilePath = navParams.get('filePath');
      this.imageFileName = navParams.get('filename');

      this.userProfileFormData = navParams.get('formData');
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad CreateUserProfilePage');

      this.setDatePickerBounds();

      this.utilService.getUserAccountFromStorage()
      .then(val => {
        this.userAccount = val;
      });
    }

    createUserProfile() {
      if(this.userAccount) { //Only proceed if userAccount has been loaded

        this.utilService.getAuthHeadersFromStorage().then(val => {
          const authHeaders = this.utilService.createHeadersObjFromAuth(val);

          const today = this.utilService.getCurrentDateInValidFormat();
          this.userProfileFormData = JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            birthdate: this.birthdate,
            zip: this.zip,
            maritalStatus: this.maritalStatus,
            sex: this.sex,
            dateJoin: today,
            lastLogin: today,
            userAccount: this.userAccount
          });

          this.userService.createUserProfile(this.userProfileFormData, authHeaders)
          .map(res => res.json())
          .subscribe(result => {
            // if (result['status'] == 200) {
            //   let jsonResponseObj = JSON.parse(result['_body']);
            if (result['isSuccess']) {
              this.utilService.presentAutoDismissToast("User Profile Created! Please wait ...");

              // let userProfileObj = jsonResponseObj['userProfiles'][0];
              const userProfileObj = result['userProfiles'][0];

              this.utilService.storeUserProfile(userProfileObj);

              //Redirect newly created user to create a new match profile
              this.navCtrl.push('CreateMatchProfilePage');
            }
          }, err => console.error('ERROR', err));
        });
      }
    }

    setDatePickerBounds() {
      this.minDate = new Date('Jan 1, 1930').toISOString();
      const minAgeLim = new Date();
      minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
      this.maxDate = minAgeLim.toISOString();
    }

    addProfileImage() {
      this.navCtrl.push('ImageUploadPage', {
        profileType : 'user',
        formData: this.userProfileFormData //Pass form data so data can be restored upon return
      });
    }

  }
