import { SciChartSurface, NumericAxis, NumericAxis, FastLineRenderableSeries } from "scichart";

// Call useWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
// Alternative methods for serving wasm from webpack or offline are available on our website
SciChartSurface.useWasmFromCDN();

// Apply your licese key once before startup
SciChartSurface.setRuntimeLicenseKey("--YOUR_KEY_HERE--");

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a line series with some data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 5, 8, 10],
        yValues: [3, 1, 7, 5, 8]
    });
    const renderableSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "steelblue"
    });
    sciChartSurface.renderableSeries.add(renderableSeries);
}

initSciChart(); 