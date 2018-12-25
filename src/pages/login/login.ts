import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
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

  constructor(public navCtrl: NavController,
    public globalVarsProvider: GlobalVarsProvider,
    public formBuilder: FormBuilder, public utilService: UtilityProvider,
    public userService: UsersProvider) {

      this.userAccountForm = formBuilder.group({
        email: ['', AccountValidator.isValidEmail],
        password: ['', Validators.required]
      });
    }

    login() {
      if (ENV.AUTO_FILL == true) {
        this.email = "test@test.com";
        this.password = "password";
        this.navCtrl.push(TabsPage);
      }
      if(!this.userAccountForm.valid){
        this.submitAttempt = true;
        // this.utilService.presentDismissableToast("Please enter a valid username/password");
        return;
      }
      this.userService.authenticateUser(this.email, this.password)
      .subscribe(response => {
        //A response is only received if login is successful (only applies to this specific endpoint)
        this.utilService.presentAutoDismissToast("Login success! Please wait...");

        this.utilService.setAuthHeaders(response);

        this.retrieveUserProfile();

      }, error => {
        this.utilService.presentDismissableToast("Invalid login credentials, please try again.");
      }
    );
  }

  retrieveUserProfile() {
    this.userService.getUserProfileByEmail(this.email)
    .subscribe(resp => {
        let jsonResponseObj = JSON.parse((resp['_body']));
        let userProfileObj = jsonResponseObj['userProfiles'][0];

        //Store the retrieved user profile object in global vars
        this.globalVarsProvider.setUserProfileObj(userProfileObj);

        const currentDate = this.utilService.getCurrentDateInValidFormat();

        //Check if the lastLogin field needs to be updated
        if (userProfileObj['lastLogin'] != currentDate) {
          this.updateLastLogin(userProfileObj, currentDate);
        }
        this.navCtrl.push(TabsPage);
    }, error => console.log(error));
  }

  updateLastLogin(userProfileObj, currentDate) {
    this.userService.updateLastLogin(userProfileObj, currentDate)
    .subscribe(resp => {
      if (resp['status'] == 200) {
        console.log('updated last login');
      }
    }, error => console.log(error));
  }
}
