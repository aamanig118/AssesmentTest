import React, { useMemo } from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import  * as subscriberSelectors from "../Features/Subscriber/selectors";

const useStyles = makeStyles({
  card: {
    width: "200px",
    marginRight: "1rem",
    marginBottom: "1rem",
    float: 'left',
    display: 'inline-block'
  }
});

export default (props: any) => {
  const classes = useStyles();
  const getLastKnownMeasurement = useMemo(
    subscriberSelectors.makeNumOfTodosWithIsDoneSelector, undefined);
  const value = useSelector(state => getLastKnownMeasurement(state, props.metric));

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant={"h6"}>{props.metric}</Typography>
        <Typography variant={"h6"}>{value}</Typography>
      </CardContent>
    </Card>
  );
};
