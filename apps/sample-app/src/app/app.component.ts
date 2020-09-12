import { Component, ViewChild } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

@Component({
  selector: 'nx-angular-nest-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav;
  isSideNavOpened = false;
  isFullPage;

  constructor(private router: Router) {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        this.isFullPage = e.snapshot && e.snapshot.data ? e.snapshot.data.isFullPage : false;
      }
    });
  }

  onClickSidenavItem(path = '') {
    this.sidenav.close();
    this.router.navigate([path]).then();
  }

}
