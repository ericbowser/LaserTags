import axios from "axios";

export const saveTagInformation = (body = {}) => {
   console.log('body sending... ', body);
   return axios.post('http://localhost:32636/saveContact', body)
       .then(res => {
          console.log('response: ', res.data);
          return res.data;
       })
}

export const login = (body = {}) => {
    console.log('Login:  ', body);
    return axios.post('http://localhost:32636/login', body)
        .then(res => {
            console.log('User id: ', res.data);
            return res.data;
        })
}

export default {saveTagInformation, login};