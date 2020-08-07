import React, { useState, useEffect, useCallback } from "react";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
  Resizable
} from "react-timeseries-charts";
import { useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import  * as subscriberSelectors from "../Subscriber/selectors";
import { IState } from '../../store';
import {actions} from '../Subscriber/reducer';

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

const colors = [
  "#CD6155",
  "#AF7AC5",
  "#5499C7",
  "#48C9B0",
  "#52BE80",
  "#F4D03F"
];

const getMetrics = (state: IState) => {
    return state.metrics.selectedMetrics;
};

const calcThirtyMinutesAgo: any = () => (new Date() as any) - 30 * 60 * 1000;
const thirtyMinutesAgo = calcThirtyMinutesAgo();


export default () => {
  const dispatch = useDispatch();
  const metrics: any = useSelector(getMetrics);
  const axis = useSelector(subscriberSelectors.getAxis);
  const series = useSelector(subscriberSelectors.getSeries);
  const trafficSeries = useSelector(
    subscriberSelectors.getTrafficSeries
  );

  const receiveMultipleMeasurements = useCallback(
    getMultipleMeasurements =>
      dispatch(actions.setMultipleReceivedMeasurement(
        getMultipleMeasurements
      )),
    [dispatch]
  );

  const [queryResult] = useQuery(
    {
      query,
      variables: {
        input: metrics.map((metricName: string) => ({
          metricName,
          after: thirtyMinutesAgo
        }))
      }
    }
  );
  useEffect(
    () => {
      const { data } = queryResult;
      if (!data || (data && !data.getMultipleMeasurements.length)) return;
      receiveMultipleMeasurements(data.getMultipleMeasurements);
    },
    [queryResult, receiveMultipleMeasurements]
  );

  const [tracker, setTracker] = useState(null);
  const [trackerInfo, setTrackerInfo] = useState<{label: string, value: string}[]>([]);

  const onTrackerChanged = (t: any ) => {
    setTracker(t);
    if (!t) {
      setTrackerInfo([]);
    } else {
      setTrackerInfo(
        series.map((s: {bisect: any, name: any, at: any}) => {
          const i = s.bisect(new Date(t));
          return {
            label: s.name(),
            value: s
              .at(i)
              .get("value")
              .toString()
          };
        })
      );
    }
  };

  if (!series || series.length === 0) return null;

  return (
    <Resizable>
      <ChartContainer
        timeRange={trafficSeries.timerange([
          calcThirtyMinutesAgo(),
          new Date().getTime()
        ])}
        onTrackerChanged={onTrackerChanged}
        trackerPosition={tracker}
      >
        <ChartRow
          height={400}
          trackerShowTime={true}
          trackerInfoValues={trackerInfo}
          trackerInfoHeight={10 + trackerInfo.length * 16}
          trackerInfoWidth={140}
        >
          {axis.map((metricSeries: any, i: number) => (
            <YAxis
              key={i}
              id={metricSeries.id}
              label={metricSeries.label}
              min={metricSeries.min}
              max={metricSeries.max}
              width="60"
              type="linear"
            />
          ))}
          <Charts>
            {series.map((metricSeries: any, i: number) => {
              const style = styler(
                series.map((s: any) => ({
                  key: "value",
                  color: colors[i],
                  selected: "#2CB1CF"
                }))
              );

              return (
                <LineChart
                  key={i}
                  style={style}
                  axis={metricSeries.atLast().get("unit")}
                  series={metricSeries}
                  column={["value"]}
                />
              );
            })}
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
};
