import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities, Users } from '../../providers';
import { DEFAULT_USER_IMG } from '../';

@IonicPage()
@Component({
  selector: 'page-user-profile-detail',
  templateUrl: 'user-profile-detail.html',
})
export class UserProfileDetailPage {

  profile: any;
  profileReady: boolean = false;
  readOnly: boolean = true;
  authHeaders: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public users: Users) {
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad UserProfileDetailPage');
      this.readOnly = this.navParams.get('readOnly');

      this.utils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
        const id = this.navParams.get('userId');
        this.retrieveUserProfile(id);
      });

    }

    retrieveUserProfile(userId: number) {
      if (userId) {
        this.users.getUserProfile(userId, this.authHeaders)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
          if (response.isSuccess) {
            console.log('user profile found');
          this.profile = response['userProfiles'][0];
          console.log('proflie image: ' + this.profile.profileImage);
          this.profile.profileImage =
              this.utils.validateImageUri(this.profile['profileImage'], DEFAULT_USER_IMG);
          this.profileReady = true;
        }

        }, err => console.error('ERROR: ', JSON.stringify(err)));
      } else {
        console.log('userId is undefined, loading user from storage');
        this.utils.getDataFromStorage('user').then(val => {
          if (!val) {
            console.log('no object found in storage for user');
          } else {
            this.profile = val;
            this.profile.profileImage =
                this.utils.validateImageUri(this.profile['profileImage'], DEFAULT_USER_IMG);
            this.profileReady = true;
          }
        });
      }
    }

    editProfile(id: number) {
      console.log('Editing user profile by id ' + id);
      console.log('Not implemented yet');
    }



  }
