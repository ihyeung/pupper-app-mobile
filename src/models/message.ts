export class Message {

  sender: any;
  receiver: any;
  timestamp: string;
  message: string;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface Message {
  [prop: string]: any;
}
