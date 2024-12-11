import React, {useEffect, useState} from 'react';
import {getContact, saveContact, updateContact} from "../api/tagApi";
import {isEmpty} from "lodash";
import QrcodeData from "./Qrcode";
import {useParams} from 'react-router-dom';
import Container from "react-bootstrap/Container";
import {Form} from "react-bootstrap";

const Contact = () => {
  const {userid} = useParams();
  console.log('user id: ', userid);
  const [allFieldsSet, setAllFieldsSet] = useState(false);
  const [needsCreated, setNeedsCreated] = useState(null);
  const [saved, setSaved] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [userId, setUserId] = useState(userid.toString() || null);

  console.log('User Id ', userId);
  const [formData, setFormData] = useState({
    petname: '',
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
  });

  const checkFormData = () => {
    const exists = Boolean(formData.address !== ''
      && formData.firstname !== ''
      && formData.lastname !== ''
      && formData.phone !== '');
    return exists;
  }

  const queryContact = async () => {
    try {
      const contact = await getContact(userId)
      console.log('get contact response: ', contact);
      if (contact) {
        return contact;
      }
    } catch (err) {
      console.error(err);
    }
  }

  function setCurrentContact(contact) {
    setNeedsCreated(false);
    setFormData(contact.contact);
    setUserId(contact.contact.userid);
    setUpdate(true);
    console.log('set user id: ', contact.contact.userid);
  }

  useEffect(() => {
    const formData = checkFormData();
    if (!formData && userId && !needsCreated) {
      queryContact()
        .then(contact => {
          if (contact.status === 204) {
            setNeedsCreated(true);
          } else if (contact.status === 201) {
            const contactData = contact.contact;
            setCurrentContact(contactData)
          }
        });
    }
  }, [userId, formData, needsCreated]);

  useEffect(() => {
  }, [formData, allFieldsSet, saved, needsCreated, update, isUpdated, userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmpty(userId)
      && !isEmpty(formData.firstname)
      && !isEmpty(formData.petname)
      && (!isEmpty(formData.phone) && !isEmpty(formData.address))
    ) {
      const request = {
        userid: userId,
        ...formData
      };
      console.log('request', request);
      if (update) {
        try {
          const updateResponse = await updateContact(formData);
          if (updateResponse) {
            setIsUpdated(true);
          }
        } catch (err) {
          console.log(err);
        }
      } else if (!update) {
        const contact = await saveContact(request);
        if (contact) {
          console.log('Saved Response: ', contact);
          setSaved(true);
          setUserId(contact?.userid);
        }
      }
    } else {
      setAllFieldsSet(false);
    }
  };

  return (
    <Container>
      <Form.FloatingLabel>Dog Tag QR Generator</Form.FloatingLabel>
      <Form className={'text-white'}
            onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Pet Name</Form.Label>
          <Form.Control
            type="text"
            as="input"
            name="petname"
            required={true}
            value={formData.petname}
            onChange={handleChange}
          />
          <Form.Label>First Name</Form.Label>
          <Form.Control
            required={true}
            type="text"
            as="input"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            as="input"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            as="input"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="phone"
            as="input"
            name="phone"
            required={true}
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          {update === true ? 'Update' : 'Create Contact Info'}
        </button>
      </Form>
      {
        saved &&
        <div>
          <QrcodeData userid={userid}/>
          <span className={'text-3xl text-green-400'}>Saved!</span>
        </div>
      }
      {
        isUpdated &&
        <span className={'text-3xl text-green-400'}>Updated!</span>
      }
    </Container>
  )
}

export default Contact;