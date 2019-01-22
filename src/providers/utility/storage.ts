import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment';

@Injectable()
export class StorageUtilities {

  constructor(private storage: Storage, private transfer: FileTransfer) { }

  async uploadFile(userId: number, matchId: number, imageUri: string) {
    const authToken = await this.getJwt();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'profilePic',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: authToken,
      httpMethod: 'PUT'
    };

    const url = matchId === null ? `${ENV.BASE_URL}/user/${userId}/upload` :
    `${ENV.BASE_URL}/user/${userId}/matchProfile/${matchId}/upload`;

    return fileTransfer.upload(imageUri, url, options);
  }
    async clearStorage() {
      await this.storage.clear();
    }

    storeData(key: string, val: any) {
      this.storage.set(key, val);
    }

    getDataFromStorage(key: string) {
      return this.storage.get(key).then(val => {
        return val;
      });
    }

    async removeDataFromStorage(key: string) {
      await this.storage.remove(key);
    }

    getJwt() {
      return this.storage.get('authHeaders').then(val => {
        if (val) {
          return { 'Authorization': val['Authorization']};
        }
      });
    }

    authHeadersObjFromStorageToHeaders() {
      return this.storage.get('authHeaders').then(val => {
        if (!val) {
          console.log('ERROR RETRIEVING AUTH HEADERS FROM STORAGE');
          return null;
        }
        const type = val['Content-Type'];
        const jwt = val['Authorization'];

        return new Headers({ 'Content-Type': type, 'Authorization': jwt });
      });
    }

    extractAndStoreAuthHeaders(response) {
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': response.headers.get('Authorization')
      };
      this.storage.set('authHeaders', authHeaders);
      return authHeaders;
    }

    createHeadersObjFromAuth(authHeadersObj) {
      const jsonType = authHeadersObj['Content-Type'];
      const jwt = authHeadersObj['Authorization'];

      return new Headers({ 'Content-Type': jsonType, 'Authorization': jwt });
    }
  }
