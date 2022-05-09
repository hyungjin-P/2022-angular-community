import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mypage-via',
  templateUrl: './mypage-via.component.html',
  styleUrls: ['./mypage-via.component.scss']
})
export class MypageViaComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
    this.router.navigateByUrl('mypage').then();
  }

  ngOnInit(): void {}
}
