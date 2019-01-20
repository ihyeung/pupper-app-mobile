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
