import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DonutPercentConfig } from './donut-percent-config';
import { DonutPercentComponent } from './donut-percent.component';
import { ChartDefaults } from '../chart.defaults';

describe('Component: donut chart', () => {

  let comp: DonutPercentComponent;
  let fixture: ComponentFixture<DonutPercentComponent>;

  let config: DonutPercentConfig;
  let data: any;

  beforeEach(() => {
    config = {
      'chartId': 'testDonutChart',
      data: {},
      onClickFn: function(d: any, e: any) {
      },
      centerLabel: 'center'
    };
    data = {
      used: 10,
      total: 20
    };
  });


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule],
      declarations: [DonutPercentComponent],
      providers: [ChartDefaults]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DonutPercentComponent);
        comp = fixture.componentInstance;
        comp.config = config;
        comp.chartData = data;
        fixture.detectChanges();
      });
  }));


  it('should allow attribute specification of chart height', () => {
    config.chartHeight = 120;
    fixture.detectChanges();
    expect(comp.config.size.height).toBe(120);
  });

  it('should update when the chart height attribute changes', () => {
    config.chartHeight = 120;

    fixture.detectChanges();
    expect(comp.donutChartId).toBe('testDonutChartdonutPctChart');
    expect(comp.config.size.height).toBe(120);

    config.chartHeight = 100;
    fixture.detectChanges();
    expect(comp.config.size.height).toBe(100);
  });


  it('should setup C3 chart data correctly', () => {
    expect(comp.config.data.columns.length).toBe(2);
    expect(comp.config.data.columns[0][0]).toBe('Used');
    expect(comp.config.data.columns[1][0]).toBe('Available');
  });

  it('should update C3 chart data when data changes', () => {
    expect(comp.config.data.columns.length).toBe(2);
    expect(comp.config.data.columns[0][0]).toBe('Used');
    expect(comp.config.data.columns[0][1]).toBe(10);

    data.used = 5;
    fixture.detectChanges();

    expect(comp.config.data.columns[0][1]).toBe(5);
    expect(comp.config.data.columns[1][1]).toBe(15);
  });

  it('should setup onclick correctly', () => {
    expect(typeof(comp.config.data.onclick)).toBe('function');
  });

  it('should show center label', () => {
    expect(comp.getCenterLabelText().bigText).toBe('center');
    expect(comp.getCenterLabelText().smText).toBe('');
  });

});
