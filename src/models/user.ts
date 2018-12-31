export class User {

  id: number;
  firstName: string;
  lastName: string;
  zipCode: string;
  sex: string;
  birthdate: string;
  maritalStatus: string;
  profileImage: string;
  dateJoin: string;
  lastLogin: string;
  aboutMe: string;


  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface MatchProfile {
  [prop: string]: any;
}
