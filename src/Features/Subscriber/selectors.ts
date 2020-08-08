import {
    createSelector
} from "reselect";
import {
    TimeSeries
} from "pondjs";

type Selector = (state: {metrics: {selectedMetrics: string[]}}) => string[]


const getMetrics: Selector = (state: {metrics: {selectedMetrics: string[]}}) => state.metrics.selectedMetrics;
const state = (state: any) => state.measurements;

export const getSeries = createSelector(state, getMetrics, (state: any, selectedMetrics: string[]) => {
    const availableValues = Object.keys(state).filter((metric: string) => selectedMetrics.indexOf(metric) > -1).map(item => state[item]);
    return availableValues;
});

export const makeNumOfTodosWithIsDoneSelector = () =>
    createSelector(
        state,
        (_: any, metric: string) => metric,
        (measurements, metric) => {
            if (!measurements[metric]) return "---";
            return measurements[metric].atLast().get("value");
        }
    );

export const getTrafficSeries = createSelector(getSeries, series => {
 
    const timeseries: any = TimeSeries;
    const trafficSeries = timeseries.timeSeriesListMerge({
        name: "Metrics",
        seriesList: series
    });
    return trafficSeries;
});

export const getAxis = createSelector(getSeries, series => {
    const axis = series.filter((r) => r).reduce((accum: Array<{id: string, label: string, min: number, max: number}>, elem: {atLast: Function, min: Function, max: Function}) => {
        const unit = elem.atLast().get("unit");
        const existingElement = accum.find((a: {id: string}) => a.id === unit);
        if (!existingElement) {
            accum.push({
                id: unit,
                label: unit,
                min: elem.min(),
                max: elem.max()
            });
        } else {
            const existingMin = elem.min();
            const existingMax = elem.max();
            existingElement.min = Math.min(existingElement.min, existingMin);
            existingElement.max = Math.max(existingElement.max, existingMax);
        }
        return accum;
    }, []);

    return axis;
});