import axios from 'axios';

const baseUrl = process.env.LASER_BACKEND_BASE_URL;

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
    const url = `${baseUrl}/getContact/${userid}`;
    let data = {};
    const contact = await axios.get(url);


    switch (contact.exists) {
      case true:
        console.log('contact exists: ', contact);
        data = {
          status: contact.status,
          userid: userid,
          contact: contact.data,
          exists: true
        };

        return contact;
        break;
      case false:
        console.log('contact not created: ', contact);
        data = {
          status: contact.status,
          exists: false
        };

        return data;
        break;
      default:
        return null;
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