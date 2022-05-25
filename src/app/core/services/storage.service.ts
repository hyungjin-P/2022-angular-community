import {Injectable} from '@angular/core'
import {AngularFireAuth} from '@angular/fire/auth'

declare let Kakao: any

import {GlobalService} from '@services/global.service'

import {User} from '@schemas/user'
import {CryptoService} from "@services/crypto.service";

@Injectable({providedIn: 'root'})
export class StorageService {

  private storage: Storage = sessionStorage;
  private userKey: string = 'authAccess';

  constructor(    private angularFireAuth: AngularFireAuth,
                  private globalService: GlobalService,

    private cryptoService: CryptoService
  ) {}

  getUser(): User {
    const encryptText: string = this.storage.getItem(this.userKey);

    let decryptObj: any = null;

    if (encryptText) {
      decryptObj = this.cryptoService.decrypt(encryptText);
    }

    return decryptObj;
  }

  setUser(user: User): void {
    const encryptText = this.cryptoService.encrypt(user);

    this.storage.setItem('authAccess' , encryptText);

    this.globalService.variables.isLogin = true;

    /** global service */
    this.globalService.user.nickname = user.nickname;

    if (user.picture) {
      this.globalService.user.picture =
        user.picture?.length === 0 ? null : user.picture[0];
    } else {
      this.globalService.user.picture = null;
    }

    if (user.background) {
      this.globalService.user.background =
        user.background?.length === 0 ? null : user.background[0];
    } else {
      this.globalService.user.background = null;
    }
  }

  async removeUser() {
    if (Kakao.Auth && Kakao.Auth.getAccessToken()) {
      const logout = new Promise((resolve, reject) => {
        Kakao.Auth.logout(() => {
          resolve(null)
        })
      });

      await logout
    }
    await this.angularFireAuth.signOut();
    this.storage.removeItem(this.userKey);
    this.globalService.variables.isLogin = false;
    this.globalService.user.nickname = '';
    this.globalService.user.picture = null;
    this.globalService.user.background = null;
  }
}
