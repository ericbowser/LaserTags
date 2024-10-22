import axios from 'axios';

async function saveContact(body = {}) {
    console.log('body sending... ', body);
    try {
        const response = await axios.post('http://localhost:32636/saveContact', body);
        if (response?.user) {
            console.log('response.data: ', response.data);
            return response.data;
        } else {
            console.error('failed to save contact', response);
            return response;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getContact = async (userid = null) => {
    console.log('body id: ', userid);
    try {
        const url = `http://localhost:32636/getContact/${userid}`;
        let data = {};
        const contact = await axios.get(url);
        console.log('fetched contact: ', contact);
        if (contact.status === 204) {
            console.log('contact not created: ', contact);
            data = {
                status: contact.status,
                userid: contact?.data?.userid,
                contact: contact?.data,
                exists: false
            };
            return data;
        } else {
            console.log('contact exists or was created: ', contact.data);
            data = {
                status: contact.status,
                userid: userid,
                contact: contact.data,
                exists: true,
            };
            
            return data;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

const updateContact = async (body = {}) => {
    console.log('body sending... ', body);
    try {
        const contact = 
            await axios.post('http://localhost:32636/updateContact', body);
        
        return contact.data?.contactUpdated || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function login(body = {}) {
    console.log('Login:  ', body);
    try {
        const user = 
            await axios.post('http://localhost:32636/login', body);
        if (user.data) {
            console.log('user id: ', user.data.userid);
            return user.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {saveContact, getContact, login, updateContact};