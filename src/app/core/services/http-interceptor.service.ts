import {Injectable} from '@angular/core'
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {Observable} from 'rxjs'
import {StorageService} from '@services/storage.service'

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private storageService: StorageService) {
  }

  /**
   * Injectable => provide 범위 root에서만 동착 (services)
   * */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.storageService.getUser();
    if (user?.accessToken) {
      const request: HttpRequest<any> = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      return next.handle(request)
    } else {
      return next.handle(req);
    }
  }
}
