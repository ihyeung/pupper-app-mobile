import { FormControl } from '@angular/forms';

export class ProfileValidator {

  static isValidName(control: FormControl): any {
    let validNameRegEx = /^[a-zA-Z\s]*$/;
    if(!validNameRegEx.test(control.value)){
      return {
        "Not a valid name": true
      };
    }
    return null;
  }

  static isValidZipCode(control: FormControl): any {

    let zipCodeRegEx = /^\d{5}$/;
    if(!zipCodeRegEx.test(control.value)){
      return {
        "Not a valid 5-digit zipcode": true
      };
    }
    return null;
  }

}
