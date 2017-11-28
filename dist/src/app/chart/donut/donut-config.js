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
import { ChartConfig } from '../chart-config';
/**
 * A config containing properties for the sparkline chart
 */
var DonutConfig = (function (_super) {
    __extends(DonutConfig, _super);
    function DonutConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DonutConfig;
}(ChartConfig));
export { DonutConfig };
//# sourceMappingURL=donut-config.js.map