import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountValidator } from  '../../validators/account.validator';
import { UtilityProvider } from '../../providers/utility/utilities';
import { UsersProvider } from '../../providers/http/userProfiles';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  responseData: any;
  email: string;
  password: string;
  userAccountForm: FormGroup;
  loginAttempted: boolean = false;
  userAuthType: string = "login";

  constructor(public navCtrl: NavController,
    public globalVarsProvider: GlobalVarsProvider,
    public formBuilder: FormBuilder, public utilService: UtilityProvider,
    public userService: UsersProvider, public accountValidator: AccountValidator,
    private storage: Storage) {

      this.userAccountForm = formBuilder.group({
        email: ['', accountValidator.isValidEmail],
        password: ['', Validators.required],
        confirm: ['', Validators.minLength(5)]
      });
    }

    authenticateUser() {
      if(!this.userAccountForm.valid){
        this.loginAttempted = true;
        return;
      }
      if (this.userAuthType == 'login') {
        this.login();
      } else {
        this.register();
      }
    }

    register() {
      this.userService.createUserAccount(this.email, this.password)
      .subscribe(response => {
        if (response['status'] == 200) {
          let jsonResponseObj = JSON.parse(response['_body']);
          if (jsonResponseObj['responseCode'] == 409) {
            this.utilService.presentDismissableToast("A user account with your selected username already exists." +
            " Please login as an existing user or create a user profile using a unique username.");
            return;
          }
          //login to get authentiation token
          this.login();
          
          this.navCtrl.push('CreateUserProfilePage');
        }
      }, error => console.log(error));
    }

      login() {

      this.userService.authenticateUser(this.email, this.password)
      .subscribe(response => {
        //A response is only received if login is successful (only applies to this specific endpoint)
        this.utilService.presentAutoDismissToast("Login success! Please wait...");

        const auth = this.utilService.setAuthHeaders(response);
        this.storage.set('auth', auth);

        this.retrieveUserProfile();

      }, error => {
        this.utilService.presentDismissableToast("Invalid login credentials, please try again.");
      }
    );
  }

  retrieveUserProfile() {
    this.userService.getUserProfileByEmail(this.email)
    .subscribe(resp => {
        let jsonResponseObj = JSON.parse(resp['_body']);
        let userProfileObj = jsonResponseObj['userProfiles'][0];

        //Store the retrieved user profile object
        // this.globalVarsProvider.setUserProfileObj(userProfileObj);
        this.storage.set('user', userProfileObj);
        const currentDate = this.utilService.getCurrentDateInValidFormat();

        //Check if the lastLogin field needs to be updated
        if (userProfileObj['lastLogin'] != currentDate) {
          this.updateLastLogin(userProfileObj, currentDate);
        }
        this.navCtrl.push('TabsPage');
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
