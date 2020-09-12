import { Component, ViewChild } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'nx-angular-nest-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav;
  isSideNavOpened = false;
  isFullPage;

  constructor(private router: Router, private spinnerService: NgxUiLoaderService) {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        this.isFullPage = e.snapshot && e.snapshot.data ? e.snapshot.data.isFullPage : false;
      }
    });

    // this.spinnerService.start();
  }

  onClickSidenavItem(path = '') {
    this.sidenav.close();
    this.router.navigate([path]).then();
  }

}
