import { DoCheck, OnInit } from '@angular/core';
import { ChartDefaults } from '../chart.defaults';
import { ChartBase } from '../chart.base';
import { DonutPercentConfig } from './donut-percent-config';
export declare class DonutPercentComponent extends ChartBase implements DoCheck, OnInit {
    private chartDefaults;
    chartData: any;
    config: DonutPercentConfig;
    donutChartId: any;
    private prevChartData;
    private currentThreshold;
    private subscriptions;
    /**
     * Default constructor
     * @param chartDefaults
     */
    constructor(chartDefaults: ChartDefaults);
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    getCenterLabelText(): any;
    private updateAvailable();
    private updatePercentage();
    private getStatusColor(used, thresholds);
    private getDonutStatusColor();
    private donutTooltip();
    private chartAvailable(chart);
    private getTotal();
    private setupDonutChartTitle(chart);
    private getDonutData(chartData);
    private setupConfigDefaults();
    private updateConfig();
}
