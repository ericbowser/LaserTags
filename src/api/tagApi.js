import axios from 'axios';
import {LASER_BACKEND_BASE_URL} from '../../env.json';

async function saveContact(body = {}) {
  console.log('saveContact - body being sent to backend:', JSON.stringify(body, null, 2));
  console.log('saveContact - field breakdown:', {
    firstname: body.firstname,
    lastname: body.lastname,
    fullname: body.fullname,
    petname: body.petname,
    phone: body.phone,
    address: body.address,
    address_length: body.address?.length || 0
  });
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveContact`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201) {
      console.log('saveContact - response data: ', response.data);
      return response.data;
    } else {
      console.error('saveContact - failed to save contact', response);
      return response;
    }
  } catch (error) {
    console.error('saveContact - error:', error);
    if (error.response) {
      console.error('saveContact - error response data:', error.response.data);
      console.error('saveContact - error response status:', error.response.status);
    }
    return null;
  }
}

async function getContact(userid = null){
  console.log('body id: ', userid);
  try {
    let data = {};
    const url = `${LASER_BACKEND_BASE_URL}/getContact/${userid}`;
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
      await axios.post(`${LASER_BACKEND_BASE_URL}/updateContact`, body);

    return contact.data?.contactUpdated || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createOrder(body = {}) {
  console.log('createOrder - body being sent to backend:', JSON.stringify(body, null, 2));
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/createOrder`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('createOrder - response data: ', response.data);
    
    const orderid = response.data?.id;
    
    if (orderid) {
      console.log('createOrder - orderid: ', orderid);
      return orderid;
    } else {
      console.error('createOrder - no orderid in response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('createOrder - error:', error);
    if (error.response) {
      console.error('createOrder - error response data:', error.response.data);
      console.error('createOrder - error response status:', error.response.status);
    }
    return null;
  }
}


async function loginBackendLaser(body = {}) {
  try {
    const user = await axios.post(`${LASER_BACKEND_BASE_URL}/login`, body);
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

async function saveQrCode(body = {}) {
  console.log('Saving QR code... ', body);
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveQrCode`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201) {
      console.log('QR code saved: ', response.data);
      return response;
    } else {
      console.error('Failed to save QR code', response);
      return response;
    }
  } catch (error) {
    console.error('Error saving QR code:', error);
    return null;
  }
}

async function updateOrderPayment(body = {}) {
  console.log('Updating order payment... ', body);
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/updateOrderPayment`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      console.log('Order payment updated: ', response.data);
      return response;
    } else {
      console.error('Failed to update order payment', response);
      return response;
    }
  } catch (error) {
    console.error('Error updating order payment:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return null;
  }
}

async function sendEmail(body = {}) {
  console.log('Sending email... ', body);
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/sendEmail`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      console.log('Email sent successfully: ', response.data);
      return response;
    } else {
      console.error('Failed to send email', response);
      return response;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return null;
  }
}

export {saveContact, getContact, loginBackendLaser, updateContact, saveQrCode, updateOrderPayment, createOrder, sendEmail};