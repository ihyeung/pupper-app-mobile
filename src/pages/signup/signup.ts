import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';
import { UsersProvider } from '../../providers/http/userProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  zip: string;
  maritalStatus: any;
  sex: any;
  minDate: string;
  maxDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http, public globalVarsProvider: GlobalVarsProvider,
    public utilService: UtilityProvider, public userService: UsersProvider) {
      this.minDate = new Date('Jan 1, 1930').toISOString();
      const minAgeLim = new Date();
      minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
          this.maxDate = minAgeLim.toISOString();
  }

    createUserAccountAndProfile() {
      if (this.userInputIsValid()) {
          this.userService.createUserAccount(this.email, this.password)
          .subscribe(result => {
            if (result['status'] == 200) {
              let jsonResponseObj = JSON.parse(result['_body']); //Parse response body string resp['_body']into JSON object to extract data
              if (jsonResponseObj['responseCode'] == 409) {
                this.utilService.presentDismissableToast("A user account with your selected username already exists." +
                "Please login as an existing user or create a user profile using a unique username.");
                return;
              }
              let userAccountObj = jsonResponseObj['userAccounts'][0]; //Pass the userAccount in the response to createUserProfile()

              this.createUser(userAccountObj);
            }
          }, error => console.log(error));}
      }

      createUser(userAccountObj) {

        this.userService.authenticateUser(this.email, this.password)
        .subscribe(response => {
          this.utilService.setAuthHeaders(response);

          this.createUserProfile(userAccountObj);
      }, error => console.log(error)
    );
  }

  createUserProfile(userAccountObj) {
    if (this.userInputIsValid()) {
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
        userAccount: userAccountObj
      });

      const createUserProfileUrl = ENV.BASE_URL + '/user';
      console.log('Creating a new user profile: ' + createUserProfileUrl);

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

              this.navCtrl.push(TabsPage, {}, { animate: true });
            }
          }
        }, error => console.log(error)
      );
    }
  }

  userInputIsValid() {
    let isValid = false;
    if (!this.email || !this.validateEmailFormat(this.email)) {
      this.utilService.presentAutoDismissToast("Please enter a valid email");
    }
    else if (!this.password || !this.validatePasswordFormat(this.password)) {
      this.utilService.presentAutoDismissToast("A valid password is 8 or more characters, with "
      + "at least one capital letter, one number and one special character.");
    }
    else if (!this.firstName || !this.lastName || !this.isValidStringInput(this.firstName)
    || !this.isValidStringInput(this.lastName)) {
      this.utilService.presentAutoDismissToast("Please enter a valid first and last name.");
    }
    else if (!this.birthdate) {
      this.utilService.presentAutoDismissToast("Please enter your birthdate.");
    }
    else if (!this.validateFiveDigitUSZipCode(this.zip)) {
      this.utilService.presentAutoDismissToast("Please enter a valid 5-digit United States zipcode.");
    }
    else if (!this.maritalStatus || !this.sex) {
      this.utilService.presentAutoDismissToast("Please indicate your marital status and sex.");
    } else {
      console.log("all fileds validated successfully");
      isValid = true;
    }
    return isValid;
  }

  //narrow range to US zip codes, as we are not currently accepting country codes
  validateFiveDigitUSZipCode(zipCode) {
    return /^\d{5}$/.test(zipCode);
  }

  isValidStringInput(strToCheck) {
    let validStringFormat = /^[a-zA-Z\s]*$/;
    return validStringFormat.test(strToCheck);
  }

  validateEmailFormat(emailIn) {
    let format = /\S+@\S+\.\S+/;
    return format.test(emailIn);
  }

  validatePasswordFormat(passwordIn): boolean {
    let validPwdFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return validPwdFormat.test(passwordIn);
  }
}
