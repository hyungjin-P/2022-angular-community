import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage.service';
import { User } from '@schemas/user';

@Component({
  selector: 'app-mypage-via',
  templateUrl: './mypage-via.component.html',
  styleUrls: ['./mypage-via.component.scss'],
})
export class MypageViaComponent implements OnInit {
  constructor(private router: Router, private storageService: StorageService) {
    const user: User = storageService.getUser();
    this.router.navigateByUrl(`mypage/${user.id}/feed`).then();
  }

  ngOnInit(): void {}
}
