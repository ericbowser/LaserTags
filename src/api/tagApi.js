import axios from "axios";

const saveTagInformation = (body = {}) => {
   console.log('body sending... ', body);
   return axios.post('http://localhost:32636/saveLaserTag', body)
       .then(res => {
          console.log('response: ', res.data);
          return res.data;
       })
}

export default saveTagInformation;