import axios from "axios";
import {configDotenv} from "dotenv";

const config = configDotenv();

async function saveContact(body = {}) {
    console.log('body sending... ', body);
    try {
        const response = await axios.post(config.parsed.SAVE_CONTACT_URL, body);
        if (response.data) {
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

const getContact = async (userid = '') => {
    console.log('body id: ', userid);
    try {
        const url = `${config.parsed.GET_CONTACT_URL}${userid}`
        const contact = await axios.get(url);
        if (contact.data.exists) {
            return {...contact, exists: true};
        } else {
            return contact;
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
            await axios.post(config.parsed.UPDATE_CONTACT_URL, body);
        
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
            await axios.post(config.parsed.LOGIN_URL, body);
        console.log('user id: ', user.data.userid);
        if (user.data.userid && user.data.firstname && user.data.petname) {
            return {...user.data, exists: true};
        } else {
            return user.data.userid || null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {saveContact, getContact, login, updateContact};