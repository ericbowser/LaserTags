import axios from 'axios';

const LASER_BACKEND_BASE_URL = import.meta.env.VITE_LASER_BACKEND_BASE_URL;

async function saveContact(body = {}) {
  // Ensure all address fields are included (default to empty string if not provided)
  const requestBody = {
    ...body, // Include all fields from body first
    // Explicitly ensure address fields are always present
    address_line_1: body.address_line_1 || '',
    address_line_2: body.address_line_2 || '',
    address_line_3: body.address_line_3 || ''
  };
  
  console.log('saveContact - body being sent to backend:', JSON.stringify(requestBody, null, 2));
  console.log('saveContact - field breakdown (contact table fields):', {
    firstname: requestBody.firstname,
    lastname: requestBody.lastname,
    fullname: requestBody.fullname,
    petname: requestBody.petname,
    phone: requestBody.phone,
    address_line_1: requestBody.address_line_1,
    address_line_2: requestBody.address_line_2,
    address_line_3: requestBody.address_line_3
  });
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveContact`, requestBody, {
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

async function getContact(contactid = null){
  console.log('body id: ', contactid);
  try {
    let data = {};
    const url = `${LASER_BACKEND_BASE_URL}/getContact/${userid}`;
    const response = await axios.get(url);
    console.log('getContact - response data: ', response.data);
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

async function saveTag(body = {}) {
  // Ensure all required fields are included with proper types
  const requestBody = {
    orderid: body.orderid ? Number(body.orderid) : null,
    tagside: Array.isArray(body.tagside) ? body.tagside : [],
    text_line_1: Array.isArray(body.text_line_1) ? body.text_line_1 : [],
    text_line_2: body.text_line_2 || '',
    text_line_3: body.text_line_3 || '',
    text_line_4: Array.isArray(body.text_line_4) ? body.text_line_4 : [],
    text_line_5: body.text_line_5 || '',
    text_line_6: body.text_line_6 || '',
    notes: body.notes || ''
  };
  
  console.log('saveTag - body being sent to backend:', JSON.stringify(requestBody, null, 2));
  console.log('saveTag - field breakdown (tag table fields):', {
    orderid: requestBody.orderid,
    tagside: requestBody.tagside,
    text_line_1: requestBody.text_line_1,
    text_line_2: requestBody.text_line_2,
    text_line_3: requestBody.text_line_3,
    text_line_4: requestBody.text_line_4,
    text_line_5: requestBody.text_line_5,
    text_line_6: requestBody.text_line_6,
    notes: requestBody.notes
  });
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveTag`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201 || response.status === 200) {
      console.log('saveTag - response data: ', response.data);
      return response.data;
    } else {
      console.error('saveTag - failed to save tag', response);
      return response;
    }
  } catch (error) {
    console.error('saveTag - error:', error);
    if (error.response) {
      console.error('saveTag - error response data:', error.response.data);
      console.error('saveTag - error response status:', error.response.status);
    }
    return null;
  }
}

async function saveShipping(body = {}) {
  const requestBody = {
    orderid: body.orderid ? Number(body.orderid) : null,
    address_line_1: body.address_line_1 || '',
    address_line_2: body.address_line_2 || '',
    address_line_3: body.address_line_3 || '',
    status: body.status || 'pending'
  };
  
  console.log('saveShipping - body being sent to backend:', JSON.stringify(requestBody, null, 2));
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveShipping`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201 || response.status === 200) {
      console.log('saveShipping - response data: ', response.data);
      return response.data;
    } else {
      console.error('saveShipping - failed to save shipping', response);
      return response;
    }
  } catch (error) {
    console.error('saveShipping - error:', error);
    if (error.response) {
      console.error('saveShipping - error response data:', error.response.data);
      console.error('saveShipping - error response status:', error.response.status);
    }
    return null;
  }
}

export {saveContact, getContact, loginBackendLaser, updateContact, saveQrCode, updateOrderPayment, createOrder, sendEmail, saveTag, saveShipping};