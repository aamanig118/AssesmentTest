import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import {useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  select: {
    backgroundColor: '#fff',
    width: '150px',
    paddingLeft: '10px',
  }
}));



const query = `
query {getMetrics}
`;

const getMetrics = (state: IState) => {
  return state.metrics;
};

export default () => {
  return (
      <Metric />
  );
};

const Metric = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { metrics, selectedMetrics} = useSelector(getMetrics);
  const [result] = useQuery({
    query
  });

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricDataReceived(getMetrics));
  }, [dispatch, data, error]);

  function handleChange(e: any) {
    dispatch(actions.metricSelectionChange(e.target.value));
  }

  if (fetching) return <LinearProgress />;

  return (<FormControl className={classes.formControl}>
  <Select
  labelId="demo-simple-select-helper-label"
  id="demo-simple-select-helper"
  value={selectedMetrics}
  className={classes.select}
  multiple
  onChange={handleChange}
>
 {metrics.map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
</Select>
</FormControl>);
};
