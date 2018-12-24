import { FormControl } from '@angular/forms';

export class AccountValidator {

  static isValidEmail(control: FormControl): any {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegEx.test(control.value)){
      return {
        "Not a valid email": true
      };
    }
    return null;
  }

  static isValidPassword(control: FormControl): any {

    let passwordRegEx =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegEx.test(control.value)){
      return {
        "Not a valid password": true
      };
    }
    return null;
  }
}
