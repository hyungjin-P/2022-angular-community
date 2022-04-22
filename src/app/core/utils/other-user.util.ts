import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {User} from "@schemas/user";

@Injectable({
  providedIn: 'root',
})
export class OtherUserUtil {

  user: User;

  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {
    this.user = storageService.getUser();
  }

  public moveOtherUserMyPage(user: User, routingTargetId: string): void {
    if (this.user) {
      if (this.isOtherWriter(user, routingTargetId)) {
        this.router.navigateByUrl(`mypage/feed/${routingTargetId}`).then();
      }
    }
  }

  public isOtherWriter(user: User, routingTargetId): boolean {
    if (!user || !routingTargetId) {
      return false
    }
    return user.id !== routingTargetId;
  }

  public moveMyPage(): void {
    this.router.navigateByUrl(`mypage`).then();
  }
}
