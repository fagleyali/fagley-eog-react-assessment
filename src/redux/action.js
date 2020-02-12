const SET_METRIC = 'SET_METRIC'

const SET_MEASUREMENTS = 'SET_MEASUREMENTS'

export const setMetric = content => ({
    type: SET_METRIC,
    payload: {
        content
    }
})



export const setMeasurements = contents => ({
    type: SET_MEASUREMENTS,
    payload: {
        contents
    }
})