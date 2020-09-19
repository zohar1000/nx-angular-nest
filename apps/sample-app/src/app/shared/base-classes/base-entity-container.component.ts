import { BaseEntityService } from './base-entity.service';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';
import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit } from '@angular/core';
import { RouteChangeData } from 'ng-route-change';

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent implements OnInit {

  constructor(protected entityService: BaseEntityService,
              private activatedRoute: ActivatedRoute) {
    super();
    console.log(`${this.constructor.name} con`);
  }

  ngOnInit(): void {
    this.entityService.init(this.activatedRoute);
  }

  onRouteChange(data: RouteChangeData) {
    const pageType = data.state.data ? data.state.data.pageType : '';
    if (pageType) this.entityService.onRoute(pageType, data.state.params.id);
  }
}
