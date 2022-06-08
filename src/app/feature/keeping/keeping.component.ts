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
    this.setUpTitleListener();
  }

  private setUpTitleListener() {
    this.router.events
      .pipe(filter(e => e instanceof ResolveEnd))
      .subscribe((e: ResolveEnd) => {
        const {data} = getDeepestChildSnapshot(e.state.root);
        if (data?.title) {
          this.title.setTitle(data.title);
        }
      });
  }
}

function getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
  let deepestChild = snapshot.firstChild;

  while (deepestChild?.firstChild) {
    deepestChild = deepestChild.firstChild
  }

  return deepestChild || snapshot;
}

