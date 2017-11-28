var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { cloneDeep, defaults, isEqual, merge } from 'lodash';
import { ChartDefaults } from '../chart.defaults';
import { ChartBase } from '../chart.base';
import { DonutPercentConfig } from './donut-percent-config';
import * as d3 from 'd3';
var DonutPercentComponent = (function (_super) {
    __extends(DonutPercentComponent, _super);
    /**
     * Default constructor
     * @param chartDefaults
     */
    function DonutPercentComponent(chartDefaults) {
        var _this = _super.call(this) || this;
        _this.chartDefaults = chartDefaults;
        _this.currentThreshold = 'none';
        _this.subscriptions = [];
        return _this;
    }
    DonutPercentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.donutChartId = 'donutPctChart';
        if (this.config.chartId) {
            this.donutChartId = this.config.chartId + this.donutChartId;
        }
        this.subscriptions.push(this.chartLoaded.subscribe({
            next: function (chart) {
                _this.chartAvailable(chart);
            }
        }));
        this.setupConfigDefaults();
    };
    DonutPercentComponent.prototype.ngDoCheck = function () {
        if (!isEqual(this.config, this.prevConfig) || !isEqual(this.chartData, this.prevChartData)) {
            this.updateConfig();
            this.generateChart(this.donutChartId, true);
            this.prevChartData = cloneDeep(this.chartData);
        }
    };
    DonutPercentComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe; });
    };
    // Public for testing
    DonutPercentComponent.prototype.getCenterLabelText = function () {
        var centerLabelText;
        // default to 'used' info.
        centerLabelText = {
            bigText: this.chartData.used,
            smText: this.config.units + ' Used'
        };
        if (this.config.centerLabel) {
            centerLabelText.bigText = this.config.centerLabel;
            centerLabelText.smText = '';
        }
        else if (this.config.centerLabelType === 'none') {
            centerLabelText.bigText = '';
            centerLabelText.smText = '';
        }
        else if (this.config.centerLabelType === 'available') {
            centerLabelText.bigText = this.chartData.available;
            centerLabelText.smText = this.config.units + ' Available';
        }
        else if (this.config.centerLabelType === 'percent') {
            centerLabelText.bigText = Math.round(this.chartData.used / this.chartData.total * 100.0) + '%';
            centerLabelText.smText = 'of ' + this.chartData.total + ' ' + this.config.units;
        }
        return centerLabelText;
    };
    DonutPercentComponent.prototype.updateAvailable = function () {
        this.chartData.available = this.chartData.total - this.chartData.used;
    };
    DonutPercentComponent.prototype.updatePercentage = function () {
        this.chartData.percent = Math.round(this.chartData.used / this.chartData.total * 100.0);
    };
    DonutPercentComponent.prototype.getStatusColor = function (used, thresholds) {
        var threshold = 'none';
        var color = this.chartDefaults.pfPaletteColors.blue;
        if (thresholds) {
            threshold = 'ok';
            color = this.chartDefaults.pfPaletteColors.green;
            if (used >= thresholds.error) {
                threshold = 'error';
                color = this.chartDefaults.pfPaletteColors.red;
            }
            else if (used >= thresholds.warning) {
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
    };
    DonutPercentComponent.prototype.getDonutStatusColor = function () {
        var percentUsed = this.chartData.used / this.chartData.total * 100.0;
        return {
            pattern: [
                this.getStatusColor(percentUsed, this.config.thresholds),
                this.chartDefaults.pfPaletteColors.black300
            ]
        };
    };
    DonutPercentComponent.prototype.donutTooltip = function () {
        var _this = this;
        return {
            contents: function (data) {
                var tooltipHtml;
                if (_this.config.tooltipFn) {
                    tooltipHtml = '<span class="donut-tooltip-pf" style="white-space: nowrap;">' +
                        _this.config.tooltipFn(data) +
                        '</span>';
                }
                else {
                    tooltipHtml = '<span class="donut-tooltip-pf" style="white-space: nowrap;">' +
                        Math.round(data[0].ratio * 100) + '%' + ' ' + _this.config.units + ' ' + data[0].name +
                        '</span>';
                }
                return tooltipHtml;
            }
        };
    };
    DonutPercentComponent.prototype.chartAvailable = function (chart) {
        this.setupDonutChartTitle(chart);
    };
    DonutPercentComponent.prototype.getTotal = function () {
        var total = 0;
        this.chartData.forEach(function (element) {
            if (!isNaN(element[1])) {
                total += Number(element[1]);
            }
        });
        return total;
    };
    DonutPercentComponent.prototype.setupDonutChartTitle = function (chart) {
        var donutChartTitle, centerLabelText;
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
        }
        else {
            donutChartTitle.insert('tspan', null).text(centerLabelText.bigText)
                .classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
            donutChartTitle.insert('tspan', null).text(centerLabelText.smText).
                classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);
        }
    };
    DonutPercentComponent.prototype.getDonutData = function (chartData) {
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
    };
    DonutPercentComponent.prototype.setupConfigDefaults = function () {
        var defaultConfig = this.chartDefaults.getDefaultDonutConfig();
        var defaultDonut = this.chartDefaults.getDefaultDonut();
        defaults(this.config, defaultConfig);
        defaults(this.config.donut, defaultDonut);
    };
    DonutPercentComponent.prototype.updateConfig = function () {
        this.config.data = merge(this.config.data, this.getDonutData(this.chartData));
        if (this.config.chartHeight) {
            this.config.size.height = this.config.chartHeight;
        }
        if (this.config.onClickFn) {
            this.config.data.onclick = this.config.onClickFn;
        }
        this.config.color = this.getDonutStatusColor();
        this.config.tooltip = this.donutTooltip();
    };
    return DonutPercentComponent;
}(ChartBase));
__decorate([
    Input(),
    __metadata("design:type", Object)
], DonutPercentComponent.prototype, "chartData", void 0);
__decorate([
    Input(),
    __metadata("design:type", DonutPercentConfig)
], DonutPercentComponent.prototype, "config", void 0);
DonutPercentComponent = __decorate([
    Component({
        selector: 'pfng-chart-donut-percent',
        template: "<div #chartElement id=\"{{donutChartId}}\"></div>"
    }),
    __metadata("design:paramtypes", [ChartDefaults])
], DonutPercentComponent);
export { DonutPercentComponent };
//# sourceMappingURL=donut-percent.component.js.map