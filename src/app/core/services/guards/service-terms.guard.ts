import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { StorageService } from '@services/storage.service'

@Injectable({
    providedIn: 'root',
})
export class ServiceTermsGuard implements CanActivate {
    constructor(private router: Router, private storageService: StorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.storageService.getUser()

        if (user && (!user.agreement_age || !user.agreement_privacy || !user.agreement_service_terms)) {
            this.router.navigateByUrl('/auth/service-terms')
            return false
        } else {
            return true
        }
    }
}
