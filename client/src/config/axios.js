import axios from 'axios';


export const client = axios.create({
  baseURL: '/api',
  responseType: 'json',
})

export const middlewareConfig = {
  interceptors: {
    request: [
      function ({getState, dispatch, getSourceAction}, req) {
        if (getState().auth.token)
          req.headers['Authorization'] = getState().auth.token
        return req
      }
    ]
  }
};