import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
declare let Kakao: any

import { User } from '@schemas/user'

@Injectable({ providedIn: 'root' })
export class StorageService {
    private storage: Storage
    private userKey: string

    constructor(private angularFireAuth: AngularFireAuth) {
        this.storage = sessionStorage
        this.userKey = 'keeping:authUser'
    }

    getUser(): User {
        return JSON.parse(this.storage.getItem(this.userKey))
    }

    setUser(user: User): void {
        this.storage.setItem(this.userKey, JSON.stringify(user))
    }

    async removeUser() {
        if (Kakao.Auth && Kakao.Auth.getAccessToken()) {
            const logout = new Promise((resolve, reject) => {
                Kakao.Auth.logout(() => {
                    resolve(null)
                })
            })

            await logout
        }
        await this.angularFireAuth.signOut()
        this.storage.removeItem(this.userKey)
    }
}
