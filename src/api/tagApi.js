import axios from "axios";

const saveTagInformation = (body = {}) => {
    console.log('body sending... ', body);
    return axios.post('http://localhost:32636/saveContact', body)
        .then(res => {
            console.log('save tag information response: ', res.data);
            return res.data;
        })
}

const getContact = async (body = {}) => {
    console.log('body sending... ', body);
    const contact = await axios.post('http://localhost:32636/getContact', body);
    console.log('contact: ', contact);
    return contact;
}

const updateContact = async (body = {}) => {
    console.log('body sending... ', body);
    const contact = await axios.post('http://localhost:32636/updateContact', body);
    console.log('contact: ', contact);
    return contact;
}

async function login(body = {}) {
    console.log('Login:  ', body);
    const user = await axios.post('http://localhost:32636/login', body);
    console.log(user?.data.userid);
    return user.data?.userid;
}

export {saveTagInformation, getContact, login, updateContact};