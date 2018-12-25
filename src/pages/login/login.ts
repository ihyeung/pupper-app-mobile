import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountValidator } from  '../../validators/account';
import { UtilityProvider } from '../../providers/utility/utilities';
import { UsersProvider } from '../../providers/http/userProfiles';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  responseData: any;
  email: string;
  password: string;
  userAccountForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public http: Http,
              public globalVarsProvider: GlobalVarsProvider,
              public formBuilder: FormBuilder, public utilService: UtilityProvider,
              public userService: UsersProvider) {

      this.userAccountForm = formBuilder.group({
        email: ['', AccountValidator.isValidEmail],
        password: ['', Validators.required]
      });
  }

  login() {
    if(!this.userAccountForm.valid){
      this.submitAttempt = true;
      this.utilService.presentDismissableToast("Please enter a valid username/password");
      return;
    }

      this.userService.authenticateUser(this.email, this.password)
        .subscribe(response => {
            //A response is only received if login is successful (only applies to this specific endpoint)
            this.utilService.presentAutoDismissToast("Login success! Happy Puppering.");

            this.utilService.setAuthHeaders(response);

            this.retrieveUserProfileForLastLoginUpdate();
        },
          error => {
            this.utilService.presentDismissableToast("Invalid login credentials, please try again.");
          }
        );
  }

  retrieveUserProfileForLastLoginUpdate() {
    const retrieveUserProfileUrl = ENV.BASE_URL + '/user?email=' + this.email;
    this.http.get(retrieveUserProfileUrl,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(resp => {
        if (resp['status'] == 403) {
          this.utilService.presentAutoDismissToast("Your session has expired. Please log in again.");
          return;
        }
        else if (resp['status'] == 400 || resp['status'] == 404 || resp['status'] == 422) {
          this.utilService.presentAutoDismissToast("Error loading User Profile data.");
          return;
        }
        else if (resp['status'] == 200) {
          let jsonResponseObj = JSON.parse((resp['_body']));
          let userProfileData = jsonResponseObj['userProfiles'][0];

          //Store the retrieved user profile object in global vars
          this.globalVarsProvider.setUserProfileObj(userProfileData);

          //Check if the lastLogin field needs to be updated
          const currentDate = this.utilService.getCurrentDateInValidFormat();
          if (userProfileData['lastLogin'] != currentDate) {
            this.updateLastLoginTimestampForUserProfile(userProfileData, currentDate);
          }
          this.navCtrl.push(TabsPage);
        }
      }, error => console.log(error)
      );
  }

  updateLastLoginTimestampForUserProfile(userProfileObj, timestamp) {

    const updateLastLoginUrlString = ENV.BASE_URL +
      "/user/" + userProfileObj['id'] + "?lastLogin=" + timestamp;
    this.http.put(updateLastLoginUrlString, userProfileObj,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(resp => {
      }, error => console.log(error));
  }
}
