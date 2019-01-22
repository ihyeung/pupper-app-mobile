import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { StorageUtilities, Utilities, MatchProfiles, Users } from '../../providers';
import { USER_PROFILE_ERROR } from '../';

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
  matchProfilesList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public storageUtils: StorageUtilities,
    public matchProfiles: MatchProfiles, public users: Users,
    public loadCtrl: LoadingController) { }

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
        this.repopulateInputFieldData();
      }
    }

    retrieveDataFromStorage() {
      this.storageUtils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });

      this.storageUtils.getDataFromStorage('breeds').then(val => {
        this.breedList = val;
      });

      this.storageUtils.getDataFromStorage('user').then(val => {
        if (!val) {
          this.utils.presentAutoDismissToast(USER_PROFILE_ERROR);
          this.navCtrl.push('CreateUserProfilePage');
        } else {
          this.userProfile = val;
        }
      });

      this.storageUtils.getDataFromStorage('profiles').then(val => {
        if (val) {
          this.matchProfilesList = val;
        } else {
          this.retrieveAllMatchProfiles();
        }
      })
    }

    retrieveAllMatchProfiles() {
      this.matchProfiles.getMatchProfiles(this.userProfile)
      .map(res => res.json())
      .subscribe(resp => {
        if (resp.isSuccess && resp.matchProfiles) {
          this.matchProfilesList = resp.matchProfiles;
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    public createMatchProfile() {
      let loader = this.loadCtrl.create({
        content: "Creating profile ..."
      });
      loader.present();

      this.matchProfileFormData = this.getDataFromInputFields();
      if (!this.matchProfileFormData.isDefault) {
        if (this.matchProfilesList === undefined || this.matchProfilesList.length == 0) {
          this.matchProfileFormData['isDefault'] = true; //Override isDefault flag
        }
      }
      console.log('Dog preferences: ' + this.dogPreferences);

      const userProfileId = this.userProfile['id'];
      this.matchProfiles.createMatchProfile(
        JSON.stringify(this.matchProfileFormData), userProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
          if (response.isSuccess) {
            const matchProfileObj = response['matchProfiles'][0];
            this.checkForMultipleDefaultMatchProfiles(matchProfileObj);

            this.uploadProfileImageForMatchProfile(matchProfileObj, loader);
          }
        }, err => {
          console.error('ERROR: ', JSON.stringify(err));
          loader.dismiss();
        });
      }

      async uploadProfileImageForMatchProfile(matchProfileObj: any, loader: any) {
        const matchId = matchProfileObj['id'];
        const userId = matchProfileObj['userProfile']['id'];
        let response = await this.storageUtils.uploadFile(userId, matchId, this.imageFilePath);
        console.log('response from file upload: ' + JSON.stringify(response));
        loader.dismiss();
        if (response.response['isSuccess']) {
          const profileImage = response.response['imageUrl'];

          matchProfileObj['profileImage'] = profileImage; //Update profileImage field after upload before storing in storage
          this.storageUtils.storeData(' match', matchProfileObj);
          this.utils.presentAutoDismissToast("Match Profile Created! Please wait ...");

          this.navCtrl.push('TabsPage');
        } else {
          //Profile image was not successfully uploaded and updated in database
          this.utils.presentDismissableToast('Error uploading profile image');
        }
      }

      private checkForMultipleDefaultMatchProfiles(matchProfileObj: any) {
        if (matchProfileObj['isDefault']) { //If newly created profile isDefault, reset default flag for other match profiles
          if (!this.matchProfilesList) {
            console.log('Error: matchProfilesList is undefined or null');
            return;
          }
          this.matchProfilesList.forEach(each => {
            if (each['isDefault']) { //If another match profile is marked as default, override isDefault to false and update
              this.updateIsDefaultForMatchProfile(each, false);
            }
          });
        }
      }

      updateIsDefaultForMatchProfile(matchProfile: any, isDefault: boolean) {
        matchProfile['isDefault'] = isDefault;
        const userId = matchProfile['userProfile']['id'];

        this.matchProfiles.updateMatchProfile(matchProfile, userId)
        .map(res => res.json())
        .subscribe(resp => {
          if (!resp.isSuccess) {
            console.log('Error updating isDefault field for match profile id=' + matchProfile['id']);
          }
        }, err => console.error('ERROR: ', JSON.stringify(err)));
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
          // dogPreferences: this.dogPreferences
        };
      }


      repopulateInputFieldData() {
        const profile = this.matchProfileFormData;
        this.names = profile.names;
        this.sex = profile.sex;
        this.breed = profile.breed;
        this.birthdate = profile.birthdate;
        this.radius = profile.zipRadius;
        this.lifeStage = profile.lifeStage;
        this.energyLevel = profile.energyLevel;
        this.aboutMe = profile.aboutMe;
        // this.numDogs = profile.numDogs;
        this.isActiveMatchProfile = profile.isDefault;
        // this.dogPreferences = profile.dogPreferences;

      }
    }
