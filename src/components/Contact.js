import React, {useEffect, useMemo, useState} from 'react';
import {getContact, saveContact, updateContact} from "../api/tagApi";
import {isEmpty} from "lodash";
import QrcodeData from "./Qrcode";
import {useParams} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

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
      if (contact) {
        setCurrentContact(contact);
        return contact;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function setCurrentContact(contact) {
    setNeedsCreated(false);
    setFormData(contact.contact);
    setUserId(contact.contact.userid);
    setUpdate(true);
    console.log('set user id: ', contact.contact.userid);
  }

  const queryContactInfo = async () => {
    const contact = await queryContact();
    if (contact) {
      setNeedsCreated(false);
      setCurrentContact(contact.contact);
    } else {
      setNeedsCreated(true);
      setCurrentContact(null);
    }

    return contact;
  }

  useMemo(() => {
    const formData = checkFormData();
    if (!formData && userId) {
      queryContactInfo().then(contact => console.log('contact: ', contact));
    }
  }, [userId, formData]);

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
    <Container className={'text-center'}>
      <FloatingLabel>Dog Tag QR Generator</FloatingLabel>
      <Form className={'text-white'}
            onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Pet Name</FormLabel>
          <FormControl
            type="text"
            as="input"
            name="petname"
            required={true}
            value={formData.petname}
            onChange={handleChange}
          />
          <FormLabel>First Name</FormLabel>
          <FormControl
            required={true}
            type="text"
            as="input"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <FormLabel>Last Name</FormLabel>
          <FormControl
            type="text"
            as="input"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <FormLabel>Address</FormLabel>
          <FormControl
            type="text"
            as="input"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <FormLabel>Phone</FormLabel>
          <FormControl
            type="phone"
            as="input"
            name="phone"
            required={true}
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>
        <Button
          type="submit"
          variant={'primary'}
        >
          {update === true ? 'Update' : 'Create Contact Info'}
        </Button>
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