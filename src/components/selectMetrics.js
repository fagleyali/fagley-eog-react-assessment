import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setMetric } from '../redux/action';

const metrics = [
    "waterTemp",
    "casingPressure",
    "injValveOpen",
    "flareTemp",
    "oilTemp",
    "tubingPressure",
];

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

const SelectMetrics = (props) => {

    const classes = useStyles();
    // const [metric, setMetric] = React.useState('');
    
    let metric = useSelector((state)=> state.metric);
    
    const dispatch = useDispatch();

    const handleChange = event => {
        dispatch(setMetric(event.target.value))
        console.log(metric)
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
                {metrics.map(option => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        </div>

    );
}

export default SelectMetrics;

