import { Component, OnInit } from '@angular/core';
import {StorageService} from "@services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "@schemas/user";

@Component({
  selector: 'app-via-login-success',
  templateUrl: './via-login-success.component.html',
  styleUrls: ['./via-login-success.component.scss']
})
export class ViaLoginSuccessComponent implements OnInit {

  user: User;

  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe(data => {
      setTimeout( () => {
        this.router.navigateByUrl('feed').then()
      }, 50);
    });
  }

  ngOnInit(): void {

  }

}
