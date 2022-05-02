import { Component, OnInit } from '@angular/core';
import {StorageService} from "@services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-via-signup-success',
  templateUrl: './via-signup-success.component.html',
  styleUrls: ['./via-signup-success.component.scss']
})
export class ViaSignupSuccessComponent implements OnInit {

  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe(data => {
      setTimeout( () => {
        this.router.navigateByUrl('feed').then()
      }, 100);
    });
  }

  ngOnInit(): void {
  }

}
