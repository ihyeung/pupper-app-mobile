export class User {

  id: number;
  firstName: string;
  lastName: string;
  sex: string;
  birthdate: string;
  maritalStatus: string;
  zip: string;
  dateJoin: string;
  lastLogin: string;
  profileImage: string;

  userAccount: any;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface User {
  [prop: string]: any;
}
