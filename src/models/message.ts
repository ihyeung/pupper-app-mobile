export class Message {
  sender: any;
  receiver: any;
  timestamp: string;
  message: string;

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface Message {
  [prop: string]: any;
}
