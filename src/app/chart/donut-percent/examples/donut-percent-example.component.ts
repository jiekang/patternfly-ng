import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'donut-percent-example',
  templateUrl: './donut-percent-example.component.html'
})
export class DonutPercentExampleComponent implements OnInit {
  public config: any = {
    chartId: 'exampleDonutPercent',
    units: 'GB',
    thresholds: {
      'warning': 60,
      'error': 90
    },
    onClickFn: (data: any, element: any) => {
      alert('You clicked on donut arc: ' + data.id);
    }
  };

  public data: any = {
    used: 900,
    total: 1000
  };

  constructor() {
  }

  ngOnInit(): void {
    Observable
      .timer(0, 1000)
      .map(() => Math.floor(Math.random() * 900) + 1)
      .subscribe(val => this.data.used = val);
  }
}
