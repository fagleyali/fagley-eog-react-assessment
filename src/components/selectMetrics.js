import React from 'react';
import { MenuItem, TextField, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setMetric } from '../redux/action';

const metricsName = [
    "waterTemp",
    "casingPressure",
    "injValveOpen",
    "flareTemp",
    "oilTemp",
    "tubingPressure",
];

const useStyles = makeStyles({
    root: {
      minWidth: 275,
      float: "left"
    },
    
    title: {
      fontSize: 14,
    },
    
  });

const SelectMetrics = (props) => {

    const classes = useStyles();

    let initialState = {
        metrics:[]
    }
    
    const [state, setState] = React.useState(initialState);
    
    let metric = useSelector((state)=> state.metric);
    
    const dispatch = useDispatch();

    const handleChange = event => {
        dispatch(setMetric(event.target.value))
        let metrics = state.metrics;
        metrics.push(event.target.value);
        setState({metrics})
    };
    const handleDelete = event => {
        dispatch(setMetric(event.target.value))
        let metrics = state.metrics;
        metrics.push(event.target.value);
        setState({metrics})
    };
    return (
        <div>
            <TextField
                id="outlined-select-currency"
                select
                label="Select"
                value={metric}
                onChange={handleChange}
                helperText="Please select metric"
                variant="outlined"
                style={{float:"right",margin:"20px"}}
            >
                {metricsName.map(option => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            {state.metrics.map(metric=>(
                <Card key={metric} className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title}>
                            {metric}
                        </Typography>
                    </CardContent>
                       
                </Card>
            ))}
        </div>

    );
}

export default SelectMetrics;

