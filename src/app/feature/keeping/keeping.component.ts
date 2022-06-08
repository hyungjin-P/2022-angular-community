import {Component, OnInit} from '@angular/core'
import {Title} from "@angular/platform-browser";
import {ActivatedRouteSnapshot, ResolveEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'keeping',
  templateUrl: './keeping.component.html',
  styleUrls: ['./keeping.component.scss'],
})
export class KeepingComponent implements OnInit {
  constructor(
    private title: Title,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }
}
