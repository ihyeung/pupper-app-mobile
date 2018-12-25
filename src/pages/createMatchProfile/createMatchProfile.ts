import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular'
import { DogProfilePicPage } from '../dogProfilePic/dogProfilePic';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment';

@Component({
  selector: 'page-createMatchProfile',
  templateUrl: 'createMatchProfile.html'
})
export class CreateMatchProfilePage {
  aboutMe: string;
  birthdate: string;
  breed: any;
  energyLevel: string;
  lifeStage: any;
  names: string;
  numDogs: 1;
  profileImage: any;
  sex: string;
  size: string;
  formData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, private toastCtrl: ToastController,
    public globalVarsProvider: GlobalVarsProvider, public http: Http) {
  }

  public createDogProfileBtnClick() {
    if (this.userInputIsValid()) {
      const breedLookupUrl = ENV.BASE_URL + 'pupper/breed?name=' + this.breed;
      this.http.get(breedLookupUrl,
        { headers: this.globalVarsProvider.getAuthHeaders() })
        .subscribe(result => {
          if (result['status'] != 200) {
            this.presentToast("Please enter a valid breed name.");
            return;
          }

          let breedResponse = JSON.parse(result['_body']);
          this.createMatchProfileFromWithBreedObj(breedResponse);
        }, error => console.log(error)
        );
    }
  }

  public createMatchProfileFromWithBreedObj(breedObj) {
    const userProfileId = this.globalVarsProvider.getUserProfileObj()['id'];

    let matchProfileDetails = JSON.stringify({
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
    console.log("MATCHPROFILEDETAILS" + matchProfileDetails);

    const createMatchProfileUrl = ENV.BASE_URL + '/user/' + userProfileId + '/matchProfile';
    this.http.post(createMatchProfileUrl, matchProfileDetails,
      { headers: this.globalVarsProvider.getAuthHeaders() }) //For running back-end in AWS
      .subscribe(result => {
        if (result['status'] == 200) {
          let jsonResponseObj = JSON.parse((result['_body']));
          let matchProfileObj = jsonResponseObj['matchProfiles'][0];
          let matchProfileId = matchProfileObj['id'];

          this.uploadDogProfilePicFile(this.profileImage,
            matchProfileId, this.globalVarsProvider.getFileToUpload());

          let matchProfileCreated = "Match Profile Created! Please wait . . .";
          this.presentToast(matchProfileCreated);

          this.navCtrl.push(TabsPage, { matchProfileDetails });
        }
        else if (result['status'] == 400 || result['status'] == 404) {
          this.presentToast("There's an error with one of your matchProfile fields, this status code should never happen.");
        }
      }, error => console.log(error)
      );
  }

  public uploadDogProfilePicFile(file: Blob, matchProfileId, imageFilePath) {
    let formData = new FormData();
    formData.append('profilePic', file);

    let authToken = this.globalVarsProvider.getAuthHeaders().get('Authorization');
    const formheadersWithAuth = new Headers({
      'Authorization': authToken
    });

    const userProfileId = this.globalVarsProvider.getUserProfileObj()['id'];

    let imageUploadEndpoint = ENV.BASE_URL + '/upload/user/' + userProfileId +
    '/matchProfile/' + matchProfileId;

    //uncomment the code below after the image controller endpoint has been changed on the backend
    // let imageUploadEndpoint = ENV.BASE_URL + '/user/' + userProfileId +
    // '/matchProfile/' + matchProfileId + 'upload';

    this.http.put(imageUploadEndpoint, formData,
      { headers: formheadersWithAuth })
      .subscribe(result => {
        if (result['status'] == 200) {
          console.log('Image uploaded successfully.');
        } else {
          console.log('Error uploading profile image');
        }
      }, error => console.log(error)
      );
  }

  userInputIsValid() {
    if (!this.isValidStringInput(this.names)) {
      this.presentToast("Please enter a valid name.");
      return false;
    }
    if (!this.birthdate) {
      this.presentToast("Please select a birthdate.");
      return false;
    }
    if (!this.energyLevel || !this.lifeStage || !this.sex || !this.breed) {
      this.presentToast("Please select a valid breed, energy level, age, and gender.");
      return false;
    }
    if (!this.aboutMe || !this.isValidAboutMeInput(this.aboutMe)) {
      this.presentToast("Please enter a short bio about your pup.");
      return false;
    }
    return true;
  }

  //Valid String Input Classified as: a-z, A-z
  isValidStringInput(strToCheck) {
    let validStringFormat = /^[a-zA-Z\s]*$/;
    return validStringFormat.test(strToCheck);
  }

  //Valid About Me Input Classified as: a-z, A-z, digits, following symbols: _.,!"'
  isValidAboutMeInput(strToCheck) {
    let validStringFormat = /[A-Za-z0-9 _.,!"'/$]*/;
    return validStringFormat.test(strToCheck);
  }

  presentToast(msgToDisplay) {
    let toast = this.toastCtrl.create({
      message: msgToDisplay,
      duration: 2500,
      position: 'middle'
    });
    toast.present();
  }

  addDogProfilePic() {
    this.navCtrl.push(DogProfilePicPage, {});
  }

}
