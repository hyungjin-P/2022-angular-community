import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scrap-feed',
  templateUrl: './scrap-feed.component.html',
  styleUrls: ['./scrap-feed.component.scss'],
})
export class ScrapFeedComponent implements OnInit {
  feeds: any[] = [{ text: '' }];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }
}
