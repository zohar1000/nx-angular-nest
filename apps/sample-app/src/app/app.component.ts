import { Component, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nx-angular-nest-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav;
  isSideNavOpened = true;

  constructor(private router: Router) {}

  onClickSidenavItem(item = '') {
    this.sidenav.close();
    this.router.navigate([item]).then();
  }

}
