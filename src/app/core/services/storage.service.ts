import {Injectable} from '@angular/core'
import {AngularFireAuth} from '@angular/fire/auth'

declare let Kakao: any

import {GlobalService} from '@services/global.service'

import {User} from '@schemas/user'

@Injectable({providedIn: 'root'})
export class StorageService {

  private storage: Storage;
  private userKey: string;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private globalService: GlobalService,

  ) {
    this.storage = sessionStorage;
    this.userKey = 'keeping:authUser';
  }

  getUser(): User {
    return JSON.parse(this.storage.getItem(this.userKey));
  }

  setUser(user: User): void {
    this.storage.setItem(this.userKey, JSON.stringify(user));
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
