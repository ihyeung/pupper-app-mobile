import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { GlobalVars, Utilities } from '../../providers';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment';

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
  imageFile: any;
  sex: string;
  size: string;
  breedList: any = [];
  imageFilePath: string;
  imageFileName: string;
  profileFormData: string;
  userProfile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globalVars: GlobalVars, public http: Http,
    public utilService: Utilities) {

      this.imageFilePath = this.navParams.get('filePath');
      this.imageFileName = this.navParams.get('filename');

      this.utilService.getBreedsFromStorage().then(val => {
        this.breedList = val;
      });

      this.utilService.getUserFromStorage().then(val => {
        this.userProfile = val;
      })
    }

    public createMatchProfile() {
      // if (this.userInputIsValid()) {
      this.utilService.presentLoadingIndicator();

      console.log(this.breed); //THIS SHOULD BE AN OBJECT, NOT A STRING

      // const breedLookupUrl = ENV.BASE_URL + '/breed?name=' + this.breed;
      // this.http.get(breedLookupUrl,
      //   { headers: this.globalVars.getAuthHeaders() })
      //   .subscribe(result => {
      //     if (result['status'] != 200) {
      //       console.log('ngModel is not passing breed name values correctly');
      //       return;
      //     }
      //
      //     let breedResponse = JSON.parse(result['_body']);
      //     this.createMatchProfileFromWithBreedObj(breedResponse);
      //   }, err => console.error('ERROR', err));

    }

    public createMatchProfileFromWithBreedObj() {
      if (this.userProfile) {
        this.utilService.getAuthHeadersFromStorage().then(val => {

        });
      const userProfileId = this.userProfile['id'];

      this.profileFormData = JSON.stringify({
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
      });

      const createMatchProfileUrl = ENV.BASE_URL + '/user/' + userProfileId + '/matchProfile';
      this.http.post(createMatchProfileUrl, this.profileFormData,
        { headers: this.globalVars.getAuthHeaders() }) //For running back-end in AWS
        .subscribe(result => {
            let jsonResponseObj = JSON.parse((result['_body']));
            let matchProfileObj = jsonResponseObj['matchProfiles'][0];
            let matchProfileId = matchProfileObj['id'];

              this.uploadProfileImage(this.imageFile,
                //TODO: figure out how to get file object from filepath (this.imageFile is undefined)
              matchProfileId, this.imageFilePath);

              this.globalVars.setMatchProfileObj(matchProfileObj);

              this.navCtrl.push('TabsPage');
          }, err => console.error('ERROR', err));
}
      }

      uploadProfileImage(file: Blob, matchProfileId, imageFilePath) {
        let formData = new FormData();
        formData.append('profilePic', file);

        let authToken = this.globalVars.getAuthHeaders().get('Authorization');
        const formheadersWithAuth = new Headers({
          'Authorization': authToken
        });

        const userProfileId = this.globalVars.getUserProfileObj()['id'];

        let imageUploadEndpoint = ENV.BASE_URL + '/user/' + userProfileId +
        '/matchProfile/' + matchProfileId + '/upload';

        this.http.put(imageUploadEndpoint, formData,
          { headers: formheadersWithAuth })
          .subscribe(() => {
              console.log('Image uploaded successfully.');
          }, err => console.error('ERROR', err));

      }

      addProfileImage() {
        this.navCtrl.push('ImageUploadPage', {
          profileType: 'match',
          formData: this.profileFormData
        });
      }

    }
