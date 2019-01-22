import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Users, StorageUtilities } from '../providers';

@Injectable()
export class AccountValidator {

  debouncer: any;
  authHeaders: any;

  constructor(public userService: Users, public utils: StorageUtilities){
    this.utils.getDataFromStorage('authHeaders').then(val => {
      this.authHeaders = val;
    });
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

  validateUniqueUserEmail(control: FormControl): any {
    //Debouncer so validation http call isnt triggered any time user types in field
    clearTimeout(this.debouncer);

    return new Promise(resolve => {

      this.debouncer = setTimeout(() => {

        this.userService.getUserAccountByEmail(control.value, this.authHeaders)
        .map(res => res.json())
        .subscribe(response => {
          if(!response.isSuccess){
            console.log('username available');
            resolve(null);
          } else {
            resolve({'usernameInUse': true});
          }
        }, err => { resolve({'usernameInUse': true});
        });

      }, 5000); //5 seconds of input field not being changed before http call to server is made

    });
  }
}
