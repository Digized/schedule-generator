import { createStore } from 'redux';

const reducer = (state, action) => {
    const res = { courses: [], mode: 0 }; //0 fall, 1 winter
    if (state === undefined) {
        return res;
    }
    res.courses = state.courses;
    res.mode = state.mode;
    if (action.type === "UPDATE"){
        res.courses = action.courses;
    }

    if(action.type === "MODE"){ 
        res.courses = [];
        res.mode = action.mode;
    }

    return res;
}

export const store = createStore(reducer);


