import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class GlobalService {
    public variables: any = {
        isTouchScreen: false,
        isLogin: false,
        navMenu: ['/', '/feed', '/community', '/market', '/magazine'],
        navMenuIndex: 0,
    }

    public modal: any = {
        data: {},
    }

    public toast: any = {
        visible: false,
        text: null,
    }

    public showModal(data: any) {
        this.modal['data'] = data
    }

    public hideModal() {
        this.modal['data'] = null
    }

    public showToast(text: string) {
        this.toast.visible = true
        this.toast.text = text
    }

    public hideToast() {
        this.toast.visible = false
    }
}
