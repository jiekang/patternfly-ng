import { ChartConfig } from '../chart-config';
/**
 * A config containing properties for the sparkline chart
 */
export declare class DonutPercentConfig extends ChartConfig {
    /**
     * Text for the donut chart center label (optional)
     */
    centerLabel?: any;
    /**
     * Type of center label; ignored if centerLabel is set (optional)
     *   'none', 'available', 'percent'
     */
    centerLabelType?: string;
    /**
     * An optional function to handle when donut is clicked
     */
    onClickFn?: (data: any, element: any) => void;
    /**
     * An optional function to handle tooltip generation
     */
    tooltipFn?: (data: any) => void;
    /**
     * The height of the donut chart (optional)
     */
    chartHeight?: number;
    /**
     * The unit label for values, ex: 'MHz','GB', etc.
     */
    units?: string;
    /**
     * Warning and error percentage thresholds used to determine the Usage Percentage fill color (optional), e.g.
     * thresholds :  {
     *   'warning' : 60
     *   'error' : 90
     * }
     */
    thresholds?: any;
    /**
     * Optional function called when threshold changes
     *
     * threshold: {
     *  threshold: <threshold-value>
     * }
     *
     * threshold-values:
     *   'ok', 'warning' or 'error'
     */
    onThresholdChange?: (threshold: any) => void;
    /**
     * C3 inherited configuration for color
     */
    color?: any;
    /**
     * C3 inherited configuration for size
     */
    size?: any;
    /**
     * C3 inherited donut configuration
     */
    donut?: any;
    /**
     * C3 inherited configuration for tooltip
     */
    tooltip?: any;
}
