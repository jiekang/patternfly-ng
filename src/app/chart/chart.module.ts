import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonutComponent } from './donut/donut.component';
import { DonutPercentComponent } from './donut-percent/donut-percent.component';
import { SparklineComponent } from './sparkline/sparkline.component';
import { ChartDefaults } from './chart.defaults';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [SparklineComponent, DonutComponent, DonutPercentComponent],
  exports: [SparklineComponent, DonutComponent, DonutPercentComponent],
  providers: [ChartDefaults]
})
export class ChartModule {}
