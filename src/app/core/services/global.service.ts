import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class GlobalService {
    public variables: any = {
        isTouchScreen: false,
        isLogin: false,
        navMenu: ['/', '/feed', '/community', '/market', '/magazine'],
        navMenuIndex: 0,
    }
}
