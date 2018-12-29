import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';
import { UsersProvider } from '../../providers/http/userProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  templateUrl: 'createUserProfile.html'
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public globalVarsProvider: GlobalVarsProvider,
    public utilService: UtilityProvider,
    public userService: UsersProvider,
    private storage: Storage) {

      this.imageFilePath = navParams.get('filePath');
      this.imageFileName = navParams.get('filename');

      this.setUserAgeBounds();
    }

    createUserProfile() {
      const today = this.utilService.getCurrentDateInValidFormat();
      let userProfileData = JSON.stringify({
        firstName: this.firstName,
        lastName: this.lastName,
        birthdate: this.birthdate,
        zip: this.zip,
        maritalStatus: this.maritalStatus,
        sex: this.sex,
        dateJoin: today,
        lastLogin: today,
        userAccount: this.storage.get('account')
      });

      const createUserProfileUrl = ENV.BASE_URL + '/user';
      console.log('Creating a new user profile: ' + createUserProfileUrl);
      const authHeaders = this.storage.get('auth');
      console.log('auth headers: ' + authHeaders);
      this.http.post(createUserProfileUrl, userProfileData,
        { headers: this.globalVarsProvider.getAuthHeaders() })
        .subscribe(result => {
          if (result['status'] == 200) {
            let jsonResponseObj = JSON.parse(result['_body']);
            if (jsonResponseObj['isSuccess'] == true) {
              this.utilService.presentAutoDismissToast("User Profile Created! Please wait ...");

              let userProfileObj = jsonResponseObj['userProfiles'][0];

              //Store user profile object in global vars
              this.globalVarsProvider.setUserProfileObj(userProfileObj);
              this.storage.set('user', userProfileObj);

              //Redirect newly created user to create a new match profile
              this.navCtrl.push('CreateMatchProfilePage');
              }
            }
          }, error => console.log(error));
        }

        setUserAgeBounds() {
          this.minDate = new Date('Jan 1, 1930').toISOString();
          const minAgeLim = new Date();
          minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
          this.maxDate = minAgeLim.toISOString();
        }

        addProfileImage() {
          this.navCtrl.push('ImageUploadPage', { profileType : 'user' });
        }

        // userInputIsValid() {
        //   let isValid = false;
        //   if (!this.email || !this.validateEmailFormat(this.email)) {
        //     this.utilService.presentAutoDismissToast("Please enter a valid email");
        //   }
        //   else if (!this.password || !this.validatePasswordFormat(this.password)) {
        //     this.utilService.presentAutoDismissToast("A valid password is 8 or more characters, with "
        //     + "at least one capital letter, one number and one special character.");
        //   }
        //   else if (!this.firstName || !this.lastName || !this.isValidStringInput(this.firstName)
        //   || !this.isValidStringInput(this.lastName)) {
        //     this.utilService.presentAutoDismissToast("Please enter a valid first and last name.");
        //   }
        //   else if (!this.birthdate) {
        //     this.utilService.presentAutoDismissToast("Please enter your birthdate.");
        //   }
        //   else if (!this.validateFiveDigitUSZipCode(this.zip)) {
        //     this.utilService.presentAutoDismissToast("Please enter a valid 5-digit United States zipcode.");
        //   }
        //   else if (!this.maritalStatus || !this.sex) {
        //     this.utilService.presentAutoDismissToast("Please indicate your marital status and sex.");
        //   } else {
        //     console.log("all fileds validated successfully");
        //     isValid = true;
        //   }
        //   return isValid;
        // }
        //
        // //narrow range to US zip codes, as we are not currently accepting country codes
        // validateFiveDigitUSZipCode(zipCode) {
        //   return /^\d{5}$/.test(zipCode);
        // }
        //
        // isValidStringInput(strToCheck) {
        //   let validStringFormat = /^[a-zA-Z\s]*$/;
        //   return validStringFormat.test(strToCheck);
        // }
        //
        // validateEmailFormat(emailIn) {
        //   let format = /\S+@\S+\.\S+/;
        //   return format.test(emailIn);
        // }
        //
        // validatePasswordFormat(passwordIn): boolean {
        //   let validPwdFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        //   return validPwdFormat.test(passwordIn);
        // }
      }
