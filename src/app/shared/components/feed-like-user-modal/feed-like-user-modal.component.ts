import {Component, Input, OnInit} from '@angular/core';
import {User} from "@schemas/user";
import {Router} from "@angular/router";
import {StorageService} from "@services/storage.service";
import {UserService} from "@services/user.service";

declare const $;

@Component({
  selector: 'app-feed-like-user-modal',
  templateUrl: './feed-like-user-modal.component.html',
  styleUrls: ['./feed-like-user-modal.component.scss']
})
export class FeedLikeUserModalComponent implements OnInit {

  @Input() userId: string;
  user: User;
  loginUser: User;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
  ) {
    this.loginUser = this.storageService.getUser();
  }

  ngOnInit(): void {
  }

  onLikeUserModalShow(): void {
    $('#bs-follow-view-modal').modal('show');
  }

  onCloseUserModal(): void {
    $('#bs-follow-view-modal').modal('hide');
  }

}
