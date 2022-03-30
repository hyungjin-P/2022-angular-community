import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mypage-feed',
  templateUrl: './mypage-feed.component.html',
  styleUrls: ['./mypage-feed.component.scss']
})
export class MypageFeedComponent implements OnInit, AfterViewInit {

  feeds: any[] = [
    {text: ''},
  ];

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }

}
