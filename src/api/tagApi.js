import axios from "axios";

const saveTagInformation = (body = {}) => {
   console.log('body sending... ', body);
   return axios.post('http://localhost:32636/saveContact', body)
       .then(res => {
          console.log('response: ', res.data);
          return res.data;
       })
}

async function login(body = {}) {
    console.log('Login:  ', body);
    const user = await axios.post('http://localhost:32636/login', body);
    console.log(user?.data);
    return user.data;
/*
        .then(res => {
            console.log('User id: ', res.data);
            return res.data;
        })
*/
}

export {saveTagInformation, login};