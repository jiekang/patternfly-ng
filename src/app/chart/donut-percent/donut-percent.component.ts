import { Component, DoCheck, Input, OnInit } from '@angular/core';

import { cloneDeep, defaults, isEqual, merge } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { ChartDefaults } from '../chart.defaults';
import { ChartBase } from '../chart.base';
import { DonutPercentConfig } from './donut-percent-config';

import * as d3 from 'd3';

@Component({
  selector: 'pfng-chart-donut-percent',
  templateUrl: './donut-percent.component.html'
})
export class DonutPercentComponent extends ChartBase implements DoCheck, OnInit {

  @Input() chartData: any;
  @Input() config: DonutPercentConfig;

  public donutChartId: any;

  private prevChartData: any;
  private currentThreshold = 'none';

  private subscriptions: Subscription[] = [];

  /**
   * Default constructor
   * @param chartDefaults
   */
  constructor(private chartDefaults: ChartDefaults) {
    super();
  }

  ngOnInit(): void {
    this.donutChartId = 'donutPctChart';
    if (this.config.chartId) {
      this.donutChartId = this.config.chartId + this.donutChartId;
    }

    this.subscriptions.push(this.chartLoaded.subscribe({
      next: (chart: any) => {
        this.chartAvailable(chart);
      }
    }));

    this.setupConfigDefaults();
  }

  ngDoCheck(): void {
    if (!isEqual(this.config, this.prevConfig) || !isEqual(this.chartData, this.prevChartData)) {
      this.updateConfig();
      this.generateChart(this.donutChartId, true);
      this.prevChartData = cloneDeep(this.chartData);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }

  // Public for testing
  public getCenterLabelText(): any {
    let centerLabelText;

    // default to 'used' info.
    centerLabelText = {
      bigText: this.chartData.used,
      smText: this.config.units + ' Used'
    };

    if (this.config.centerLabel) {
      centerLabelText.bigText = this.config.centerLabel;
      centerLabelText.smText = '';
    } else if (this.config.centerLabelType === 'none') {
      centerLabelText.bigText = '';
      centerLabelText.smText = '';
    } else if (this.config.centerLabelType === 'available') {
      centerLabelText.bigText = this.chartData.available;
      centerLabelText.smText = this.config.units + ' Available';
    } else if (this.config.centerLabelType === 'percent') {
      centerLabelText.bigText = Math.round(this.chartData.used / this.chartData.total * 100.0) + '%';
      centerLabelText.smText = 'of ' + this.chartData.total + ' ' + this.config.units;
    }

    return centerLabelText;
  }

  private updateAvailable(): void {
    this.chartData.available = this.chartData.total - this.chartData.used;
  }

  private updatePercentage(): void {
    this.chartData.percent = Math.round(this.chartData.used / this.chartData.total * 100.0);
  }

  private getStatusColor(used: any, thresholds: any) {
    let threshold = 'none';
    let color = this.chartDefaults.pfPaletteColors.blue;

    if (thresholds) {
      threshold = 'ok';
      color = this.chartDefaults.pfPaletteColors.green;
      if (used >= thresholds.error) {
        threshold = 'error';
        color = this.chartDefaults.pfPaletteColors.red;
      } else if (used >= thresholds.warning) {
        threshold = 'warning';
        color = this.chartDefaults.pfPaletteColors.orange;
      }
    }

    if (!threshold || this.currentThreshold !== threshold) {
      this.currentThreshold = threshold;
      if (this.config.onThresholdChange) {
        this.config.onThresholdChange({ threshold: this.currentThreshold });
      }
    }

    return color;
  }

  private getDonutStatusColor(): any {
    let percentUsed = this.chartData.used / this.chartData.total * 100.0;

    return {
      pattern: [
        this.getStatusColor(percentUsed, this.config.thresholds),
        this.chartDefaults.pfPaletteColors.black300
      ]
    };
  }

  private donutTooltip(): any {
    return {
      contents: (data: any) => {
        let tooltipHtml;

        if (this.config.tooltipFn) {
          tooltipHtml = '<span class="donut-tooltip-pf" style="white-space: nowrap;">' +
            this.config.tooltipFn(data) +
            '</span>';
        } else {
          tooltipHtml = '<span class="donut-tooltip-pf" style="white-space: nowrap;">' +
            Math.round(data[0].ratio * 100) + '%' + ' ' + this.config.units + ' ' + data[0].name +
            '</span>';
        }

        return tooltipHtml;
      }
    };
  }

  private chartAvailable(chart: any): void {
    this.setupDonutChartTitle(chart);
  }

  private getTotal(): number {
    let total = 0;
    this.chartData.forEach((element: any) => {
      if (!isNaN(element[1])) {
        total += Number(element[1]);
      }
    });

    return total;
  }


  private setupDonutChartTitle(chart: any): void {
    let donutChartTitle, centerLabelText;

    if (!chart) {
      return;
    }

    donutChartTitle = d3.select(chart.element).select('text.c3-chart-arcs-title');
    if (!donutChartTitle) {
      return;
    }

    centerLabelText = this.getCenterLabelText();

    donutChartTitle.text('');
    if (centerLabelText.bigText && !centerLabelText.smText) {
      donutChartTitle.text(centerLabelText.bigText);
    } else {
      donutChartTitle.insert('tspan', null).text(centerLabelText.bigText)
        .classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
      donutChartTitle.insert('tspan', null).text(centerLabelText.smText).
        classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);
    }
  }

  private getDonutData(chartData: any): any {
    this.updateAvailable();
    this.updatePercentage();
    return {
      columns: [
        ['Used', this.chartData.used],
        ['Available', this.chartData.available]
      ],
      type: 'donut',
      donut: {
        label: {
          show: false
        }
      },
      groups: [
        ['used', 'available']
      ],
      order: null
    };
  }

  private setupConfigDefaults(): void {
    let defaultConfig = this.chartDefaults.getDefaultDonutConfig();
    let defaultDonut = this.chartDefaults.getDefaultDonut();

    defaults(this.config, defaultConfig);
    defaults(this.config.donut, defaultDonut);
  }

  private updateConfig(): void {

    this.config.data = merge(this.config.data, this.getDonutData(this.chartData));

    if (this.config.chartHeight) {
      this.config.size.height = this.config.chartHeight;
    }

    if (this.config.onClickFn) {
      this.config.data.onclick = this.config.onClickFn;
    }
    this.config.color = this.getDonutStatusColor();
    this.config.tooltip = this.donutTooltip();
  }
}
