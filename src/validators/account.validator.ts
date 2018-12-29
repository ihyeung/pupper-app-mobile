import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersProvider } from '../providers/http/userProfiles';

@Injectable()
export class AccountValidator {

  debouncer: any;

  constructor(public userService: UsersProvider){
  }

  isValidEmail(control: FormControl): any {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegEx.test(control.value)){
      return {
        "Not a valid email": true
      };
    }
    return null;
  }

  isValidPassword(control: FormControl): any {

    let passwordRegEx =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegEx.test(control.value)){
      return {
        "Not a valid password": true
      };
    }
    return null;
  }

  validateUniqueUserEmail(control: FormControl): any {
 //Debouncer so validation http call isnt triggered any time user types in field
    clearTimeout(this.debouncer);

    return new Promise(resolve => {

      this.debouncer = setTimeout(() => {

        this.userService.getUserAccountByEmail(control.value).subscribe(response => {
          if(response.ok){
            resolve(null);
          }
        }, err => { resolve({'usernameInUse': true});
        });

      }, 5000); //5 seconds of input field not being changed before http call to server is made

    });
  }
}
