import axios from 'axios';
import { 
  captureMessage, 
  captureException, 
  addBreadcrumb,
  LaserTagsBreadcrumbs 
} from '../config/sentry';

const LASER_BACKEND_BASE_URL = import.meta.env.VITE_LASER_BACKEND_BASE_URL;

async function saveContact(body = {}) {
  // Ensure all address fields are included (default to empty string if not provided)
  const requestBody = {
    ...body,
    address_line_1: body.address_line_1 || '',
    address_line_2: body.address_line_2 || '',
    address_line_3: body.address_line_3 || ''
  };
  
  addBreadcrumb('api', 'saveContact - request initiated', {
    endpoint: '/saveContact',
    firstname: requestBody.firstname,
    lastname: requestBody.lastname,
    petname: requestBody.petname,
    hasPhone: !!requestBody.phone,
    hasEmail: !!requestBody.email
  }, 'info');
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveContact`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201) {
      LaserTagsBreadcrumbs.apiSuccess('/saveContact', 201);
      captureMessage('Contact saved successfully', 'info', {
        contactId: response.data?.id,
        endpoint: '/saveContact'
      });
      return response.data;
    } else {
      captureMessage('saveContact - unexpected response status', 'warning', {
        status: response.status,
        endpoint: '/saveContact',
        expectedStatus: 201
      });
      return response;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/saveContact', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'saveContact',
      extra: {
        endpoint: '/saveContact',
        firstname: requestBody.firstname,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function getContact(contactid = null){
  addBreadcrumb('api', 'getContact - request initiated', { contactid }, 'info');
  
  try {
    let data = {};
    const url = `${LASER_BACKEND_BASE_URL}/getContact/${contactid}`;
    const response = await axios.get(url);
    
    if (response.status === 201) {
      LaserTagsBreadcrumbs.apiSuccess('/getContact', 201);
      captureMessage('Contact retrieved successfully', 'info', {
        contactId: response.data?.contact?.id,
        endpoint: '/getContact'
      });
      data = {
        exists: true,
        contact: response.data.contact
      };
      return data;
    } else if (response.status === 204) {
      captureMessage('Contact does not exist - needs creation', 'info', {
        contactId: contactid,
        endpoint: '/getContact'
      });
      data = {
        exists: false,
        contact: null
      };
    }

    return data;
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/getContact', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'getContact',
      extra: {
        endpoint: '/getContact',
        contactid: contactid,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

const updateContact = async (body = {}) => {
  addBreadcrumb('api', 'updateContact - request initiated', {
    endpoint: '/updateContact',
    hasContactId: !!body.id
  }, 'info');
  
  try {
    const contact = await axios.post(`${LASER_BACKEND_BASE_URL}/updateContact`, body);

    LaserTagsBreadcrumbs.apiSuccess('/updateContact', 200);
    captureMessage('Contact updated successfully', 'info', {
      contactId: contact.data?.contactUpdated?.id,
      endpoint: '/updateContact'
    });
    return contact.data?.contactUpdated || null;
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/updateContact', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'updateContact',
      extra: {
        endpoint: '/updateContact',
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function createOrder(body = {}) {
  addBreadcrumb('api', 'createOrder - request initiated', {
    endpoint: '/createOrder',
    hasContactId: !!body.id,
    amount: body.amount,
    currency: body.currency
  }, 'info');
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/createOrder`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const orderid = response.data?.id;
    
    if (orderid) {
      LaserTagsBreadcrumbs.orderCreated(orderid);
      captureMessage('Order created successfully', 'info', {
        orderId: orderid,
        amount: body.amount,
        endpoint: '/createOrder'
      });
      return orderid;
    } else {
      captureMessage('createOrder - no orderid in response', 'warning', {
        endpoint: '/createOrder',
        responseData: response.data
      });
      return null;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/createOrder', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'createOrder',
      extra: {
        endpoint: '/createOrder',
        amount: body.amount,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function loginBackendLaser(body = {}) {
  addBreadcrumb('api', 'loginBackendLaser - request initiated', {
    endpoint: '/login',
    hasEmail: !!body.email
  }, 'info');
  
  try {
    const user = await axios.post(`${LASER_BACKEND_BASE_URL}/login`, body);

    if (user.data) {
      LaserTagsBreadcrumbs.apiSuccess('/login', 200);
      captureMessage('User login successful', 'info', {
        userId: user.data.userid,
        endpoint: '/login'
      });
      return user.data.userid;
    } else {
      captureMessage('loginBackendLaser - no user data in response', 'warning', {
        endpoint: '/login'
      });
      return null;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/login', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'loginBackendLaser',
      extra: {
        endpoint: '/login',
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function saveQrCode(body = {}) {
  addBreadcrumb('api', 'saveQrCode - request initiated', {
    endpoint: '/saveQrCode',
    hasTagId: !!body.tagid,
    hasQrData: !!body.qr_code_data
  }, 'info');
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveQrCode`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201) {
      LaserTagsBreadcrumbs.qrCodeGenerated(body.tagid);
      captureMessage('QR code saved successfully', 'info', {
        tagId: body.tagid,
        endpoint: '/saveQrCode'
      });
      return response;
    } else {
      captureMessage('saveQrCode - unexpected response status', 'warning', {
        status: response.status,
        endpoint: '/saveQrCode',
        expectedStatus: 201
      });
      return response;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/saveQrCode', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'saveQrCode',
      extra: {
        endpoint: '/saveQrCode',
        tagId: body.tagid,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function updateOrderPayment(body = {}) {
  addBreadcrumb('api', 'updateOrderPayment - request initiated', {
    endpoint: '/updateOrderPayment',
    orderId: body.orderid,
    hasPaymentIntentId: !!body.stripe_payment_intent_id
  }, 'info');
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/updateOrderPayment`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      LaserTagsBreadcrumbs.paymentCompleted(body.orderid, body.amount);
      captureMessage('Order payment updated successfully', 'info', {
        orderId: body.orderid,
        paymentIntentId: body.stripe_payment_intent_id,
        endpoint: '/updateOrderPayment'
      });
      return response;
    } else {
      captureMessage('updateOrderPayment - unexpected response status', 'warning', {
        status: response.status,
        orderId: body.orderid,
        endpoint: '/updateOrderPayment',
        expectedStatus: 200
      });
      return response;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.paymentFailed(error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'updateOrderPayment',
      extra: {
        endpoint: '/updateOrderPayment',
        orderId: body.orderid,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function sendEmail(body = {}) {
  addBreadcrumb('api', 'sendEmail - request initiated', {
    endpoint: '/sendEmail',
    orderId: body.orderid,
    contactId: body.contactid,
    hasEmail: !!body.email
  }, 'info');
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/sendEmail`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      captureMessage('Email sent successfully', 'info', {
        orderId: body.orderid,
        email: body.email,
        endpoint: '/sendEmail'
      });
      return response;
    } else {
      captureMessage('sendEmail - unexpected response status', 'warning', {
        status: response.status,
        orderId: body.orderid,
        endpoint: '/sendEmail',
        expectedStatus: 200
      });
      return response;
    }
  } catch (error) {
    addBreadcrumb('api', 'sendEmail - error occurred', {
      endpoint: '/sendEmail',
      orderId: body.orderid,
      errorMessage: error.message
    }, 'warning');
    captureException(error, {
      component: 'tagApi.js',
      action: 'sendEmail',
      extra: {
        endpoint: '/sendEmail',
        orderId: body.orderid,
        email: body.email,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

async function saveTag(body = {}) {
  const requestBody = {
    orderid: body.orderid ? Number(body.orderid) : null,
    side_1_text_line_1: body.side_1_text_line_1 || '',
    side_1_text_line_2: body.side_1_text_line_2 || '',
    side_1_text_line_3: body.side_1_text_line_3 || '',
    side_2_text_line_1: body.side_2_text_line_1 || '',
    side_2_text_line_2: body.side_2_text_line_2 || '',
    side_2_text_line_3: body.side_2_text_line_3 || '',
    is_qr_code: body.is_qr_code !== undefined ? Boolean(body.is_qr_code) : false,
    tagside: Array.isArray(body.tagside) ? body.tagside : [],
    text_line_1: Array.isArray(body.text_line_1) ? body.text_line_1 : [],
    text_line_2: body.text_line_2 || '',
    text_line_3: body.text_line_3 || '',
    text_line_4: Array.isArray(body.text_line_4) ? body.text_line_4 : [],
    text_line_5: body.text_line_5 || '',
    text_line_6: body.text_line_6 || '',
    notes: body.notes || ''
  };
  
  addBreadcrumb('api', 'saveTag - request initiated', {
    endpoint: '/saveTag',
    orderId: requestBody.orderid,
    isQrCode: requestBody.is_qr_code,
    side1HasText: !!(requestBody.side_1_text_line_1 || requestBody.side_1_text_line_2 || requestBody.side_1_text_line_3),
    side2HasText: !!(requestBody.side_2_text_line_1 || requestBody.side_2_text_line_2 || requestBody.side_2_text_line_3)
  }, 'info');
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveTag`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201 || response.status === 200) {
      captureMessage('Tag saved successfully', 'info', {
        tagId: response.data?.id,
        orderId: requestBody.orderid,
        isQrCode: requestBody.is_qr_code,
        endpoint: '/saveTag'
      });
      return response.data;
    } else {
      captureMessage('saveTag - unexpected response status', 'warning', {
        status: response.status,
        orderId: requestBody.orderid,
        endpoint: '/saveTag',
        expectedStatus: '201 or 200'
      });
      return response;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/saveTag', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'saveTag',
      extra: {
        endpoint: '/saveTag',
        orderId: requestBody.orderid,
        isQrCode: requestBody.is_qr_code,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
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
  
  LaserTagsBreadcrumbs.shippingInfoEntered(!!requestBody.address_line_1);
  
  try {
    const response = await axios.post(`${LASER_BACKEND_BASE_URL}/saveShipping`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 201 || response.status === 200) {
      captureMessage('Shipping information saved successfully', 'info', {
        shippingId: response.data?.id,
        orderId: requestBody.orderid,
        endpoint: '/saveShipping'
      });
      return response.data;
    } else {
      captureMessage('saveShipping - unexpected response status', 'warning', {
        status: response.status,
        orderId: requestBody.orderid,
        endpoint: '/saveShipping',
        expectedStatus: '201 or 200'
      });
      return response;
    }
  } catch (error) {
    LaserTagsBreadcrumbs.apiError('/saveShipping', error.message);
    captureException(error, {
      component: 'tagApi.js',
      action: 'saveShipping',
      extra: {
        endpoint: '/saveShipping',
        orderId: requestBody.orderid,
        errorStatus: error.response?.status,
        errorData: error.response?.data
      }
    });
    return null;
  }
}

export {saveContact, getContact, loginBackendLaser, updateContact, saveQrCode, updateOrderPayment, createOrder, sendEmail, saveTag, saveShipping};
