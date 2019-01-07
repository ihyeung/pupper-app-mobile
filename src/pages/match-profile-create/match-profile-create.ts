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
  imageFileName: string;
  matchProfileFormData: any = [];
  userProfile: any;
  dogPreferences: string[];
  radius: number = 5;
  authHeaders: any;
  isActiveMatchProfile: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utilService: Utilities, public matchProfiles: MatchProfiles,
    public users: Users) {

  }

    ionViewDidLoad() {
      this.imageFilePath = this.navParams.get('filePath');
      this.imageFileName = this.navParams.get('fileName');

      this.matchProfileFormData = this.navParams.get('formData');
      console.log(this.imageFilePath);
      console.log(this.imageFileName);
      console.log(this.matchProfileFormData);

      this.utilService.getAuthHeaders().then(val => {
        this.authHeaders = val;
      })

      this.utilService.getDataFromStorage('breeds').then(val => {
        this.breedList = val;
      });

      this.utilService.getDataFromStorage('user').then(val => {
        this.userProfile = val;
      });
    }

    public createMatchProfile() {
      console.log('createMatchProfileFromWithBreedObj');
      const userProfileId = this.userProfile['id'];

      this.matchProfileFormData = {
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
        zipRadius: this.radius
      };
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

                // this.uploadProfileImage(this.imageFile,
                //   //TODO: figure out how to get file object from filepath (this.imageFile is undefined)
                // matchProfileId, this.imageFilePath);


                this.navCtrl.push('TabsPage');
            }
          }, err => console.error('ERROR', err));
      }

      private updateActiveMatchProfile(matchProfileObj: any) {
        if(this.isActiveMatchProfile) {
          let matchProfileId = matchProfileObj['id'];

          this.userProfile['activeMatchProfileId'] = matchProfileId;
          this.users.updateUserProfileById(this.userProfile, this.userProfile['id'])
          .map(res => res.json())
          .subscribe(response => {
            console.log(response);
              // let jsonResponseObj = JSON.parse((result['_body']));
              if (response.userProfiles) {

                const userProfileObj = response['userProfiles'][0];
                this.utilService.storeData('user', userProfileObj); //Update user obj in storage

              }
            }, err => console.error('ERROR', err));

          this.utilService.storeData('match', matchProfileObj); //Update default match obj in storage
        }
      }

      // uploadProfileImage(file: any, matchProfileId: number, imageFilePath: string) {
      //   const userProfileId = this.userProfile['id'];
      //   const reader = new FileReader();
      //       reader.onloadend = () => {
      //         const imgBlob = new Blob([reader.result], {type: file.type});
      //         this.matchProfiles.uploadImage(userProfileId, matchProfileId, imgBlob, imageFilePath)
      //         .subscribe(res => {
      //           console.log(res);
      //     if (res['success']) {
      //         console.log('File upload complete.')
      //     } else {
      //         console.log('File upload failed.')
      //     }
      // });
      //     }
      //       reader.readAsArrayBuffer(file);
      // }

      addProfileImage() {
        // const filepath = "/Users/iyeung/School/pupper stuff/CAPSTONE_DEMO_IMG.jpg";
        // this.matchProfiles.uploadImage(this.userProfile['id'], 100, filepath)
        // .subscribe(res => {
        //           console.log(res);
        //         } , err => console.error('ERROR ', err));
        // }
        //     if (res['success']) {
        //         console.log('File upload complete.')
        //     } else {
        //         console.log('File upload failed.')
        //     }
        // });)
        this.navCtrl.push('ImageUploadPage', {
          profileType: 'match',
          formData: this.matchProfileFormData
        });
      }
    }
