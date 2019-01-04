import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { Utilities, MatchProfiles } from '../../providers';

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
  authHeaders: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utilService: Utilities, public matchProfiles: MatchProfiles,
  public loadCtr: LoadingController) {

  }

    ionViewDidLoad() {
      this.imageFilePath = this.navParams.get('filePath');
      this.imageFileName = this.navParams.get('fileName');

      this.matchProfileFormData = this.navParams.get('formData');

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
        userProfile: this.userProfile
      };
      console.log(this.matchProfileFormData);
      console.log('Dog preferences: ' + this.dogPreferences);

      this.matchProfiles.createMatchProfile(
        JSON.stringify(this.matchProfileFormData), userProfileId)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
            // let jsonResponseObj = JSON.parse((result['_body']));
            if (response['matchProfiles']) {

              const matchProfileObj = response['matchProfiles'][0];
              console.log('Match profile object;'  + matchProfileObj);
              let matchProfileId = matchProfileObj['id'];

                // this.uploadProfileImage(this.imageFile,
                //   //TODO: figure out how to get file object from filepath (this.imageFile is undefined)
                // matchProfileId, this.imageFilePath);

                this.utilService.storeData('match', matchProfileObj);
                this.navCtrl.push('TabsPage');
            }
          }, err => console.error('ERROR', err));
      }

      uploadProfileImage(file: any, matchProfileId: number, imageFilePath: string) {
        const userProfileId = this.userProfile['id'];
        const reader = new FileReader();
            reader.onloadend = () => {
              const imgBlob = new Blob([reader.result], {type: file.type});
              this.matchProfiles.uploadImage(userProfileId, matchProfileId, imgBlob, file)
              .subscribe(res => {
                console.log(res);
          if (res['success']) {
              console.log('File upload complete.')
          } else {
              console.log('File upload failed.')
          }
      });
          }
            reader.readAsArrayBuffer(file);

      }

      addProfileImage() {
        this.navCtrl.push('ImageUploadPage', {
          profileType: 'match',
          formData: this.matchProfileFormData
        });
      }

    }
