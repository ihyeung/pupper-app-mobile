import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { StorageUtilities, Utilities, MatchProfiles, Users } from '../../providers';
import { USER_PROFILE_ERROR } from '../';
import { environment as ENV } from '../../environments/environment';

export class ProfileDataOption {
  option: string;
  value: string;

  constructor(text: string, val: string) {
    this.option = text;
    this.value = val;
  }
}

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
  lifeStage: string;
  names: string;
  sex: string;
  size: string;
  breedList: any = [];
  imageFilePath: string;
  matchProfileFormData: any = [];
  userProfile: any;
  radius: number = 5;
  authHeaders: any;
  isActiveMatchProfile: boolean = true;
  matchProfilesList: any;

  //Match profile ion options
  lifeStages: any = ['PUPPY', 'YOUNG', 'ADULT', 'MATURE'];
  sizes: ProfileDataOption[];
  energyLevels: ProfileDataOption[];

  //Matching preferences: ion options
  sizePreferences: ProfileDataOption[];
  lifeStagePreferences: ProfileDataOption[];
  energyLevelPreferences: ProfileDataOption[];

  //Matching preferences: user data
  dogSizes: string[];
  dogAges: string[];
  dogEnergies: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public storageUtils: StorageUtilities,
    public matchProfiles: MatchProfiles, public users: Users,
    public loadCtrl: LoadingController) {

    }

    ionViewDidLoad() {
      this.initializeIonOptions();

      this.extractNavParams();
      this.retrieveDataFromStorage();
    }

    initializeIonOptions() {
      this.sizes = new Array<ProfileDataOption>();
      this.energyLevels = new Array<ProfileDataOption>();
      this.lifeStagePreferences = new Array<ProfileDataOption>();

      this.sizes.push(new ProfileDataOption('TOY/PETITE (0-10 POUNDS)','TOY'));
      this.sizes.push(new ProfileDataOption('SMALL (11-25 POUNDS)','SMALL'));
      this.sizes.push(new ProfileDataOption('MEDIUM (26-50 POUNDS)','MID'));
      this.sizes.push(new ProfileDataOption('LARGE (51-99 POUNDS)','LARGE'));
      this.sizes.push(new ProfileDataOption('EXTRA LARGE (100+ POUNDS)','XLARGE'));

      this.energyLevels.push(new ProfileDataOption('MINIMAL','MIN'));
      this.energyLevels.push(new ProfileDataOption('LOW','LOW'));
      this.energyLevels.push(new ProfileDataOption('MEDIUM','MED'));
      this.energyLevels.push(new ProfileDataOption('HIGH','HIGH'));
      this.energyLevels.push(new ProfileDataOption('EXTREME','EXTREME'));

      const all = new ProfileDataOption('ALL OF THE ABOVE','ALL');

      this.lifeStages.forEach(each => {
        this.lifeStagePreferences.push(new ProfileDataOption(each, each));
      });
      this.lifeStagePreferences.push(all);

      this.sizePreferences = this.sizes.slice();
      this.sizePreferences.push(all);

      this.energyLevelPreferences = this.energyLevels.slice();
      this.energyLevelPreferences.push(all);
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
          if (!ENV.AUTO_PROCEED_FOR_TESTING) {
            this.navCtrl.push('CreateUserProfilePage');
          }
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
      if (ENV.AUTO_PROCEED_FOR_TESTING) {
        return;
      }
      this.matchProfiles.getMatchProfiles(this.userProfile)
      .map(res => res.json())
      .subscribe(resp => {
        if (resp.isSuccess && resp.matchProfiles) {
          this.matchProfilesList = resp.matchProfiles;
          this.storageUtils.storeData('profiles', this.matchProfilesList);
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    public createMatchProfile() {
      let loader = this.loadCtrl.create({
        content: "Creating profile ..."
      });
      loader.present();

      this.matchProfileFormData = this.getDataFromInputFields();

      const userProfileId = this.userProfile['id'];
      this.matchProfiles.createMatchProfile(
        JSON.stringify(this.matchProfileFormData), userProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
          if (response.isSuccess) {
            const matchProfileObj = response['matchProfiles'][0];
            this.uploadProfileImageForMatchProfile(matchProfileObj, loader);

            this.retrieveAllMatchProfiles(); //Retrieve updated list of match profiles from server
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
          this.utils.presentDismissableToast('Error uploading profile image');
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

      }
    }
