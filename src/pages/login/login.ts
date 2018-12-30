import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
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
  userForm: FormGroup;
  loginAttempted: boolean = false;
  userAuthType: string = "log in";

  constructor(public navParams: NavParams, public navCtrl: NavController,
    public globalVarsProvider: GlobalVarsProvider,
    public formBuilder: FormBuilder, public utilService: UtilityProvider,
    public userService: UsersProvider, public accountValidator: AccountValidator,
    private storage: Storage) {

      this.userAuthType = this.navParams.get('userAuthType');

      this.userForm = formBuilder.group({
        email: ['', accountValidator.isValidEmail],
        password: ['', Validators.required],
        confirm: ['', ]
      });
    }

    authenticateUser() {
      if(!this.userForm.valid){
        this.loginAttempted = true;
        return;
      }
      return this.userAuthType == 'log in' ? this.login() : this.register();
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

        const authObj = this.utilService.extractAndStoreAuthHeaders(response);


        this.retrieveUserProfile(this.utilService.createHeadersObjFromAuth(authObj));

      }, error => {
        this.utilService.presentDismissableToast("Invalid login credentials, please try again.");
      }
    );
  }

  retrieveUserProfile(headers) {
    this.userService.getUserProfileByEmail(this.email, headers)
    .subscribe(resp => {
        let jsonResponseObj = JSON.parse(resp['_body']);
        let userProfileObj = jsonResponseObj['userProfiles'][0];

        //Store the retrieved user profile object
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
