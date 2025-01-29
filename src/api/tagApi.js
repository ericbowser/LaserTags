import axios from 'axios';

const baseUrl = process.env.LASER_BACKEND_BASE_URL;

async function saveContact(body = {}) {
  console.log('body sending... ', body);
  try {
    const response = await axios.post(`${baseUrl}/saveContact`, body);
    if (response.status === 201) {
      console.log('response data: ', response.data);
      return response;
    } else {
      console.error('failed to save contact', response);
      return response;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getContact(userid = null){
  console.log('body id: ', userid);
  try {
    let data = {};
    const url = `${baseUrl}/getContact/${userid}`;
    const response = await axios.get(url);
    if (response.status === 201) {
      console.log('contact exists: ', response.data.contact);
      data = {
        exists: true,
        contact: response.data.contact
      };
      return data;
    } else if (response.status === 204) {
      console.log('contact does not exist, needs created: ', response.data);
      data = {
        exists: false,
        contact: null
      };
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const updateContact = async (body = {}) => {
  console.log('body sending... ', body);
  try {
    const contact =
      await axios.post(`${baseUrl}/updateContact`, body);

    return contact.data?.contactUpdated || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function login(body = {}) {
  console.log('Login:  ', body);
  try {
    const user = await axios.post(`${baseUrl}/login`, body);
    console.log('user: ', user);

    if (user.data) {
      console.log('user id: ', user.data.userid);
      return user.data.userid;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {saveContact, getContact, login, updateContact};