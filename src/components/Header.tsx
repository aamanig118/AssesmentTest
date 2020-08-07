import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Metrics from '../Features/Metrics/Metrics';
import MetricCard from '../Features/Card';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },  
});

export default () => {
  const classes = useStyles();

  const name = "Amani Gogula";
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          {name} EOG React Visualization Assessment
        </Typography>
        <Metrics />
      </Toolbar>
    </AppBar>
  );
};
