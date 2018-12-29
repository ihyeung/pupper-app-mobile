import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular'
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UtilityProvider } from '../../providers/utility/utilities';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment';

@IonicPage()
@Component({
  selector: 'page-createMatchProfile',
  templateUrl: 'createMatchProfile.html'
})
export class CreateMatchProfilePage {
  aboutMe: string;
  birthdate: string;
  breed: string;
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globalVarsProvider: GlobalVarsProvider, public http: Http,
    public utilService: UtilityProvider) {

      this.imageFilePath = this.navParams.get('filePath');
      this.imageFileName = this.navParams.get('filename');

      let breedData = this.navParams.get('breedList');
      if (breedData === undefined || breedData == null){
        //   console.log('no breed data from nav params');
        //   breedData = this.globalVarsProvider.getBreedData();
        // }
      } else {

        for (var i = 0; i < breedData.length; i++) {
          this.breedList.push(breedData[i]['name']);
        }
      }
    }

    public createMatchProfile() {
      // if (this.userInputIsValid()) {
      this.utilService.presentLoadingIndicator();

      const breedLookupUrl = ENV.BASE_URL + '/breed?name=' + this.breed;
      this.http.get(breedLookupUrl,
        { headers: this.globalVarsProvider.getAuthHeaders() })
        .subscribe(result => {
          if (result['status'] != 200) {
            console.log('ngModel is not passing breed name values correctly');
            return;
          }

          let breedResponse = JSON.parse(result['_body']);
          this.createMatchProfileFromWithBreedObj(breedResponse);
        }, error => console.log(error)
      );
    }

    public createMatchProfileFromWithBreedObj(breedObj) {
      const userProfileId = this.globalVarsProvider.getUserProfileObj()['id'];

      let matchProfileRequestBody = JSON.stringify({
        aboutMe: this.aboutMe,
        birthdate: this.birthdate,
        breed: breedObj,
        energyLevel: this.energyLevel,
        lifeStage: this.lifeStage,
        names: this.names,
        numDogs: 1,
        profileImage: null,
        sex: this.sex,
        size: this.size,
        userProfile: this.globalVarsProvider.getUserProfileObj()
      });

      const createMatchProfileUrl = ENV.BASE_URL + '/user/' + userProfileId + '/matchProfile';
      this.http.post(createMatchProfileUrl, matchProfileRequestBody,
        { headers: this.globalVarsProvider.getAuthHeaders() }) //For running back-end in AWS
        .subscribe(result => {
            let jsonResponseObj = JSON.parse((result['_body']));
            let matchProfileObj = jsonResponseObj['matchProfiles'][0];
            let matchProfileId = matchProfileObj['id'];

              this.uploadProfileImage(this.imageFile,
                //TODO: figure out how to get file object from filepath (this.imageFile is undefined)
              matchProfileId, this.imageFilePath);

              this.globalVarsProvider.setMatchProfileObj(matchProfileObj);

              this.navCtrl.push('TabsPage');
          }, error => console.log(error)
        );
      }

      uploadProfileImage(file: Blob, matchProfileId, imageFilePath) {
        let formData = new FormData();
        formData.append('profilePic', file);

        let authToken = this.globalVarsProvider.getAuthHeaders().get('Authorization');
        const formheadersWithAuth = new Headers({
          'Authorization': authToken
        });

        const userProfileId = this.globalVarsProvider.getUserProfileObj()['id'];

        let imageUploadEndpoint = ENV.BASE_URL + '/user/' + userProfileId +
        '/matchProfile/' + matchProfileId + '/upload';

        this.http.put(imageUploadEndpoint, formData,
          { headers: formheadersWithAuth })
          .subscribe(() => {
              console.log('Image uploaded successfully.');
          }, error => console.log(error)
        );
      }

      // userInputIsValid() {
      //   if (!this.isValidStringInput(this.names)) {
      //     this.presentToast("Please enter a valid name.");
      //     return false;
      //   }
      //   if (!this.birthdate) {
      //     this.presentToast("Please select a birthdate.");
      //     return false;
      //   }
      //   if (!this.energyLevel || !this.lifeStage || !this.sex || !this.breed) {
      //     this.presentToast("Please select a valid breed, energy level, age, and gender.");
      //     return false;
      //   }
      //   if (!this.aboutMe || !this.isValidAboutMeInput(this.aboutMe)) {
      //     this.presentToast("Please enter a short bio about your pup.");
      //     return false;
      //   }
      //   return true;
      // }

      //Valid String Input Classified as: a-z, A-z
      // isValidStringInput(strToCheck) {
      //   let validStringFormat = /^[a-zA-Z\s]*$/;
      //   return validStringFormat.test(strToCheck);
      // }
      //
      // //Valid About Me Input Classified as: a-z, A-z, digits, following symbols: _.,!"'
      // isValidAboutMeInput(strToCheck) {
      //   let validStringFormat = /[A-Za-z0-9 _.,!"'/$]*/;
      //   return validStringFormat.test(strToCheck);
      // }

      addProfileImage() {
        this.navCtrl.push('ImageUploadPage', { profileType: 'match'});
      }

    }
