import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSubscription } from "urql";
import {actions} from './reducer';

const newMessages = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;

export default () => {
  const dispatch = useDispatch();
 
  const [subscriptionResponse] = useSubscription({
      query: newMessages
  });
  const {
      data: subscriptionData
  } = subscriptionResponse;

  useEffect(
      () => {
          if (!subscriptionData) return;
         const measurement = subscriptionData.newMeasurement;
         dispatch(actions.setReceivedMeasurement({
            type: 'MEASUREMENT_RECEIVED',
            measurement,
            metric: measurement.metric
        }))
      }, [dispatch, subscriptionData]
  );

  return null;
};
