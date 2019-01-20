import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Utilities, MatchProfiles, Users } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-match-profile-create',
  templateUrl: 'match-profile-create.html'
})
export class CreateMatchProfilePage {
  aboutMe: string;
  birthdate: string;
  breed: any;
  energyLevel: string;
  lifeStages: any = ['PUPPY', 'YOUNG', 'ADULT', 'MATURE'];
  lifeStage: string;
  names: string;
  sex: string;
  size: string;
  breedList: any = [];
  imageFilePath: string;
  matchProfileFormData: any = [];
  userProfile: any;
  dogPreferences: string[];
  radius: number = 5;
  authHeaders: any;
  isActiveMatchProfile: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public matchProfiles: MatchProfiles,
    public users: Users) {

  }

    ionViewDidLoad() {
      this.extractNavParams();
      this.retrieveDataFromStorage();
    }

    extractNavParams() {
      this.imageFilePath = this.navParams.get('filePath');
      this.matchProfileFormData = this.navParams.get('formData');
      console.log('Image URI: ' + this.imageFilePath);
      if (this.matchProfileFormData) {
        console.log('profile form data passed back from image upload page');
      }
    }

    retrieveDataFromStorage() {
      this.utils.getAuthHeaders().then(val => {
        this.authHeaders = val;
      });

      this.utils.getDataFromStorage('breeds').then(val => {
        this.breedList = val;
      });

      this.utils.getDataFromStorage('user').then(val => {
        if (!val) {
          this.utils.presentAutoDismissToast("No user profile found, please create one");
          this.navCtrl.push('CreateUserProfilePage');
        } else {
          this.userProfile = val;
        }
      });
    }

    public createMatchProfile() {
      const userProfileId = this.userProfile['id'];

      this.matchProfileFormData = this.getDataFromInputFields();
      console.log(this.matchProfileFormData);
      console.log('Dog preferences: ' + this.dogPreferences);

      this.matchProfiles.createMatchProfile(
        JSON.stringify(this.matchProfileFormData), userProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
            if (response.matchProfiles) {
              const matchProfileObj = response['matchProfiles'][0];
              console.log('Match profile object;'  + matchProfileObj);
              this.updateActiveMatchProfile(matchProfileObj);

              this.uploadProfileImageForMatchProfile(matchProfileObj);
            }
          }, err => console.error('ERROR: ', err.body));
      }

      uploadProfileImageForMatchProfile(matchProfileObj: any) {
        const matchId = matchProfileObj['id'];
        const userId = matchProfileObj['userProfile']['id'];
        this.utils.uploadFile(userId, matchId, this.imageFilePath).then(val => {
          console.log('Promise resolved : ' + val);
          matchProfileObj['profileImage'] = val; //Update profileImage field after upload before storing in storage
          this.utils.storeData(' match', matchProfileObj);
          this.utils.presentAutoDismissToast("Match Profile Created! Please wait ...");

          //Redirect newly created user to create a new match profile
          this.navCtrl.push('TabsPage');
        })
      }

      private updateActiveMatchProfile(matchProfileObj: any) {
        if(this.isActiveMatchProfile) {
          let matchProfileId = matchProfileObj['id'];

          //TODO: add logic to check for other match profiles for this user, and if any are found, make sure other match profiles are not marked as default
          this.matchProfiles.getMatchProfiles(this.userProfile)
          .map(res => res.json())
          .subscribe(resp => {
            if (resp.isSuccess) {
              if (!resp.matchProfiles || resp.matchProfiles.length == 0) {
                //No other previously created match profiles, nothing to do
                return;
              } else {
                console.log(resp.matchProfiles.length + ' other match prfoiles for this user, need to make sure no others are marked as default');
                //TODO: make update calls for the previously existing match prfoile that was marked as default
              }
            }
          });
          // this.userProfile['activeMatchProfileId'] = matchProfileId;
          // this.users.updateUserProfileById(this.userProfile, this.userProfile['id'])
          // .map(res => res.json())
          // .subscribe(response => {
          //   console.log(response);
          //     // let jsonResponseObj = JSON.parse((result['_body']));
          //     if (response.userProfiles) {
          //
          //       const userProfileObj = response['userProfiles'][0];
          //       this.utils.storeData('user', userProfileObj); //Update user obj in storage
          //
          //     }
          //   }, err => console.error('ERROR: ', err.body));

          this.utils.storeData('match', matchProfileObj); //Update default match obj in storage
        }
      }

      addProfileImage() {
        const data = this.matchProfileFormData ? this.matchProfileFormData :
        this.getDataFromInputFields();

        this.navCtrl.push('ImageUploadPage', {
          profileType: 'match',
          formData: data
        });
      }

      private getDataFromInputFields() {
        const today = this.utils.currentDateToValidDateFormat();

        return {
            aboutMe: this.aboutMe,
            birthdate: this.birthdate,
            breed: this.breed,
            energyLevel: this.energyLevel,
            lifeStage: this.lifeStage,
            names: this.names,
            numDogs: 1,
            profileImage: null,
            sex: this.sex,
            size: this.size,
            userProfile: this.userProfile,
            zipRadius: this.radius,
            isDefault: this.isActiveMatchProfile
        };
      }
    }
