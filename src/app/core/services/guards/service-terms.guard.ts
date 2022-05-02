import {Injectable} from '@angular/core'
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'

import {StorageService} from '@services/storage.service'

@Injectable({
  providedIn: 'root',
})
export class ServiceTermsGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.storageService.getUser();

    if (user && (!user.agreementAge || !user.agreementPrivacy || !user.agreementServiceTerms)) {
      this.router.navigateByUrl('/auth/service-terms').then();
      return false
    } else {
      return true
    }
  }
}
