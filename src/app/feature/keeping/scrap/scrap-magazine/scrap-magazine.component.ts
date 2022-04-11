import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scrap-magazine',
  templateUrl: './scrap-magazine.component.html',
  styleUrls: ['./scrap-magazine.component.scss'],
})
export class ScrapMagazineComponent implements OnInit {
  magazine: any[] = [{ text: '' }];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goRouter(path: string): void {
    this.router.navigateByUrl(path).then();
  }
}
