import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { StorageUtilities, Utilities, MatchProfiles, Users } from '../../providers';
import { MatchPreference } from '../../models/match-preference';
import { USER_PROFILE_ERROR } from '../';
import { environment as ENV } from '../../environments/environment';

//DTO Class for representing k,v pairs for form input fields where the value doesnt match what is displayed to the user
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
  //Match profile form: user input data
  aboutMe: string;
  birthdate: string;
  breed: any;
  energyLevel: string;
  lifeStage: string;
  names: string;
  sex: string;
  size: string;
  radius: number = 5;
  isActiveMatchProfile: boolean = true;
  title: string = 'CREATE A MATCH PROFILE';

  //Objects needed for creating profile
  authHeaders: any = [];
  userProfile: any = [];
  imageFilePath: string;
  imagePreview: string;
  matchProfilesList: any = [];

  //Match profile ion options
  lifeStages: any = ['PUPPY', 'YOUNG', 'ADULT', 'MATURE'];
  breedList: any = [];
  sizes: ProfileDataOption[];
  energyLevels: ProfileDataOption[];

  //Matching preferences ion options to display to user
  sizePreferences: ProfileDataOption[];
  lifeStagePreferences: ProfileDataOption[];
  energyLevelPreferences: ProfileDataOption[];

  //Matching preferences: user data to submit to backend
  dogSizes: string[];
  dogAges: string[];
  dogEnergies: string[];

  uploadButtonLabel: string = 'Upload profile image';
  createButtonLabel: string = 'Create profile';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public storageUtils: StorageUtilities,
    public matchProfiles: MatchProfiles, public users: Users,
    public loadCtrl: LoadingController) { }

    ionViewDidLoad() {
      this.initializeIonOptions();
      this.extractNavParamsAndRetrieveStoredData();
    }

    private initializeIonOptions() {
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

      const allOption = 'ALL OF THE ABOVE';
      this.lifeStages.forEach(each => {
        this.lifeStagePreferences.push(new ProfileDataOption(each, each));
      });
      this.lifeStagePreferences.push(new ProfileDataOption(allOption,'ALL'));

      this.sizePreferences = this.sizes.slice();
      this.sizePreferences.push(new ProfileDataOption(allOption,'ALL'));

      this.energyLevelPreferences = this.energyLevels.slice();
      this.energyLevelPreferences.push(new ProfileDataOption(allOption,'ALL'));
    }

    extractNavParamsAndRetrieveStoredData() {
      if (this.navParams.get('isUpdate')) {
        this.uploadButtonLabel = 'Select a new profile image';
        this.createButtonLabel = 'Update profile';
        this.title = 'UPDATE MATCH PROFILE';
      }
      this.imagePreview = this.navParams.get('imagePreview');
      this.imageFilePath = this.navParams.get('filePath');

      const profileData = this.navParams.get('formData');
      const preferenceData = this.navParams.get('matchPreferenceData');
      console.log('Image URI: ' + this.imageFilePath);
      if (profileData) {
        console.log('profile form data passed back from image upload page');
        this.repopulateInputFieldData(profileData, preferenceData);
      }
      const newUser = this.navParams.get('isNewUser');
      newUser === null || !newUser ? this.retrieveDataFromStorage(false):
      this.retrieveDataFromStorage(true);
    }

    retrieveDataFromStorage(retrieveMatchProfileList: boolean) {
      this.storageUtils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });

      this.storageUtils.getDataFromStorage('breeds').then(val => {
        this.breedList = val;
      });

      this.storageUtils.getDataFromStorage('user').then(val => {
        if (!val) {
          if (ENV.AUTO_PROCEED_FOR_TESTING) {
            console.log('Bypassing user profile error encountered when retrieving user key from storage');
          } else {
            let alert = this.utils.presentAlert(USER_PROFILE_ERROR);
            alert.present();
            alert.onDidDismiss(() => {
              this.navCtrl.push('CreateUserProfilePage');
            });
          }
        } else {
          this.userProfile = val;
        }
      });

      if (!retrieveMatchProfileList) {
        console.log('Skipping code to retrieve match profile list from storage ' +
        'and/or from server since routed from CreateUserProfilePage (i.e., no match profiles exist yet)');
        return;
      }

      this.storageUtils.getDataFromStorage('matchProfiles').then(val => {
        if (val) {
          this.matchProfilesList = val;
        } else {
          this.retrieveAllMatchProfiles();
        }
      });
    }

    retrieveAllMatchProfiles() {
      if (ENV.AUTO_PROCEED_FOR_TESTING) {
        return;
      }
      this.matchProfiles.getMatchProfilesByUserId(this.userProfile['id'])
      .map(res => res.json())
      .subscribe(resp => {
        if (resp.isSuccess && resp.matchProfilesList) {
          this.matchProfilesList = resp.matchProfilesList;
          this.storageUtils.storeData('matchProfiles', this.matchProfilesList);
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    public createMatchProfile() {
      let loader = this.loadCtrl.create({
        content: "Creating profile ..."
      });
      loader.present();

      const matchProfileObj = this.getDataFromInputFields();

      const userProfileId = this.userProfile['id'];
      this.matchProfiles.createMatchProfile(
        JSON.stringify(matchProfileObj), userProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
          if (response.isSuccess) {
            const matchProfileObj = response['matchProfiles'][0];

            if (this.imageFilePath) {
              this.uploadProfileImageForMatchProfile(matchProfileObj, loader); //Contains nested call to insert matching preferences
            } else {
              //No need to upload image and set profileImage field for matchProfileObj, continue
              this.insertAndStoreMatchingPreferences(matchProfileObj, loader);
            }

            //Re-retrieve updated list of match profiles from server (server handles isDefault logic)

            this.retrieveAllMatchProfiles();
          }
        }, err => {
          console.error('ERROR: ', JSON.stringify(err));
          this.dismissLoader(loader);
        });
      }

      async uploadProfileImageForMatchProfile(matchProfileObj: any, loader: any) {
        const matchId = matchProfileObj['id'];
        const userId = this.userProfile['id'];
        let response;
        try {
          response = await this.storageUtils.uploadFile(userId, matchId, this.imageFilePath);
        } catch(err) {
          console.error(JSON.stringify(err));
          this.dismissLoader(loader);
          let alert = this.utils.presentAlert('Error uploading profile image');
          alert.present();
        }
        console.log('response from file upload: ' + JSON.stringify(response));
        this.dismissLoader(loader);
        const responseObj = JSON.parse(response.response);
        if (responseObj.isSuccess) {
          const profileImage = responseObj.imageUrl;
          matchProfileObj['profileImage'] = profileImage; //Update profileImage field after upload before storing in storage
          this.insertAndStoreMatchingPreferences(matchProfileObj, loader);
        }
      }

      insertAndStoreMatchingPreferences(matchProfileObj: any, loader: any) {
        this.matchingPreferencesDefaultHandler(); //Fill in defaults for any incomplete matching preference fields

        const matchPreferences = this.createMatchPreferenceArr(matchProfileObj);
        console.log("Match preferences array: ");
        console.log(JSON.stringify(matchPreferences));
        this.matchProfiles.insertMatchPreferences(matchProfileObj['id'], JSON.stringify(matchPreferences))
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
          this.dismissLoader(loader);
          if (response.isSuccess) {
            console.log('match preferences inserted successfully');
            const matchPreferencesListObj = response['matchPreferences'];
            console.log(matchPreferencesListObj);

            this.createMatchProfileSuccessHandler(matchProfileObj, matchPreferencesListObj);
          }
        }, err => {
          console.error('ERROR: ', JSON.stringify(err));
          loader.dismiss();
        });
      }

      createMatchProfileSuccessHandler(matchProfileObj: any, matchPreferences: any) {
        if (this.isActiveMatchProfile) { //Only store newly created match profile and match preferences if it was marked as default
          this.storageUtils.storeData('preferences', matchPreferences);
          this.storageUtils.storeData('match', matchProfileObj);
        }
        this.utils.presentToast("Match Profile Created! Please wait ...");
        this.navCtrl.push('TabsPage');
      }

      createMatchPreferenceArr(matchProfile: any) {
        let matchingPreferences = new Array<MatchPreference>();

        this.sanitizeMatchingPreferences(); //Replace redundant match_preference values with 'ALL'
        this.dogSizes.forEach(size => {
          matchingPreferences.push(this.addMatchPreference(matchProfile, 'SIZE', size));
        });

        this.dogAges.forEach(age => {
          matchingPreferences.push(this.addMatchPreference(matchProfile, 'AGE', age));
        });

        this.dogEnergies.forEach(energy => {
          matchingPreferences.push(this.addMatchPreference(matchProfile, 'ENERGY', energy));
        });

        return matchingPreferences;
      }

      addMatchPreference(matchProfile: any, type: string, value: string) {
        return new MatchPreference({
          matchProfile: matchProfile,
          preferenceType: type,
          matchingPreference: value
        });
      }

      selectProfileImage() {
        this.navCtrl.push('ImageUploadPage', {
          profileType: 'match',
          formData: this.getDataFromInputFields(),
          matchPreferenceData: this.matchPreferenceMapper()
        });
      }

      matchPreferenceMapper() {
        const mapper = new Map();
        mapper.set('SIZE', this.dogSizes);
        mapper.set('AGE', this.dogAges);
        mapper.set('ENERGY', this.dogEnergies);

        return mapper;
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

      repopulateInputFieldData(profile: any, preferences: any) {
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
        this.userProfile = profile.userProfile;
        this.radius = profile.zipRadius;

        if (preferences) {
          this.dogAges = preferences.get('AGE');
          this.dogSizes = preferences.get('SIZE');
          this.dogEnergies = preferences.get('ENERGY');
        }
      }

      /**
      Match preference helper method that handles the user selecting the
      'all of the above' option (in addition to other options).
      For the purposes of optimizing storing matching preferences in the database,
      Only store a single 'All' match_preference record for a given attribute as opposed to
      storing individual records for each of the possible fields for an attribute.

      i.e., if a user selects PUPPY, YOUNG, MATURE, and ALL OF THE ABOVE, store
      a single match preference ('ALL AGE') for the lifeStage attribute in the match_preference
      table, as opposed to inserting 3 or 4 records for size preferences for that match profile.

      */
      sanitizeMatchingPreferences() {
        const ALL_STR = 'ALL';
        if (this.dogSizes.indexOf(ALL_STR) > -1) {
          this.dogSizes = [ALL_STR];
        }
        if (this.dogAges.indexOf(ALL_STR) > -1) {
          this.dogAges = [ALL_STR];
        }
        if (this.dogEnergies.indexOf(ALL_STR) > -1) {
          this.dogEnergies = [ALL_STR];
        }
      }

      private matchingPreferencesDefaultHandler() {
        const DEFAULT_PREFERENCE = 'ALL';

        if (this.dogSizes === undefined || this.dogSizes.length == 0) {
          this.dogSizes = [DEFAULT_PREFERENCE];
        }
        if (this.dogAges === undefined || this.dogAges.length == 0) {
          this.dogAges = [DEFAULT_PREFERENCE];
        }
        if (this.dogEnergies === undefined || this.dogEnergies.length == 0) {
          this.dogEnergies = [DEFAULT_PREFERENCE];
        }
      }

        private dismissLoader(loader: any) {
          if (loader) {
            loader.dismiss();
            loader = null;
          }
        }
      }
