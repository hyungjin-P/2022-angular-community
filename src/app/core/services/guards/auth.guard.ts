import {Injectable} from '@angular/core'
import {Location} from '@angular/common'
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'

import {StorageService} from '@services/storage.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private location: Location, private router: Router, private storageService: StorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url.split('/');
    const user = this.storageService.getUser();

    if (user) {
      if (url[1] === 'auth') {
        if (
          url[2] === 'service-terms' &&
          (!user.agreementAge || !user.agreementPrivacy || !user.agreementServiceTerms)
        ) {
          return true;
        } else {
          this.location.back()
          return false;
        }
      } else {
        return true;
      }
    } else {
      if (url[1] === 'auth') {
        return true;
      } else {
        this.router.navigateByUrl('/auth/login').then();
        return false;
      }
    }
  }
}
