export class User {

  id: number;
  firstName: string;
  lastName: string;
  zip: string;
  sex: string;
  birthdate: string;
  maritalStatus: string;
  profileImage: string;
  dateJoin: string;
  lastLogin: string;
  activeMatchProfileId: number;
  userAccount: any;


  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface User {
  [prop: string]: any;
}
