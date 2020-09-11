import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from './base.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'temp1',
  templateUrl: './temp1.component.html',
  styleUrls: ['./temp1.component.css']
})
export class Temp1Component extends BaseComponent implements OnInit {
  ngOnInit(): void {
console.log('data:', this.data);
  }


}
