import React, {useEffect, useState} from 'react';
import {getContact, saveContact, updateContact} from "../api/tagApi";
import {isEmpty} from "lodash";
import {useNavigate, useParams} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const Contact = () => {
  const navigate = useNavigate();
  const {userid} = useParams();
  console.log('userid passed in from params: ', userid);

  const [needsCreated, setNeedsCreated] = useState(null);
  const [contact, setContact] = useState(null);
  const [contactFetched, setContactFetched] = useState(null);
  const [navigateProfile, setNavigateProfile] = useState(false);
  const [allFieldsSet, setAllFieldsSet] = useState(false);
  const [saved, setSaved] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [user, setUser] = useState(userid || -1);
  const [initialFetch, setInitialFetch] = useState(null);

  const [formData, setFormData] = useState({
    petname: '',
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (navigateProfile) {
      navigate(`/profile/${user}`, {state: {user, contact}});
    }
  }, [navigateProfile, user]);

  const checkFormData = () => {
    const exists = Boolean(formData && formData.address !== ''
      && formData.firstname !== ''
      && formData.lastname !== ''
      && formData.phone !== '');
    return exists;
  }

  async function queryContact() {
    try {
      const contact = await getContact(user)
      if (contact.exists) {
        setCurrentContact(contact);
        return contact;
      } else {
        setNeedsCreated(true);
        return contact;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function setCurrentContact(contact) {
    setNeedsCreated(false);
    setContact(contact);
    setFormData(contact);
    setFormData(contact);
    console.log('User id after contact set in state: ', user);
  }

  async function queryContactInfo() {
    const contact = await queryContact()
    if (contact.exists) {
      setCurrentContact(contact);
      setFormData(contact);
      setContactFetched(true);
    } else {
      setNeedsCreated(true);
      setContact(null);
      setContactFetched(false);
    }

    return contact;
  }

  useEffect(() => {
    const formData = checkFormData();
    if (!contact && user && !needsCreated) {
      queryContactInfo().then(theContact => {
        console.log('contact: ', theContact);
        if (theContact.exists) {
          setContact(theContact.contact);
          setFormData(theContact.contact);
          setInitialFetch(false);
        } else {
          setNeedsCreated(true);
          setFormData(null);
          setContact(null);
          /*
                    setSpinner(false);
          */
        }
      })
    }
  }, [contact, user, needsCreated]);

  useEffect(() => {
  }, [allFieldsSet, saved, contactFetched, contact]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmpty(user)
      && !isEmpty(formData.firstname)
      && !isEmpty(formData.petname)
      && (!isEmpty(formData.phone) && !isEmpty(formData.address))
    ) {
      const request = {
        userid: user,
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
      } else {
        const contact = await saveContact(request);
        if (contact) {
          console.log('Saved Response: ', contact);
          setSaved(true);
          setUser(contact?.userid);
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
            value={formData?.petname}
            onChange={handleChange}
          />
          <FormLabel>First Name</FormLabel>
          <FormControl
            required={true}
            type="text"
            as="input"
            name="firstname"
            value={formData?.firstname}
            onChange={handleChange}
          />
          <FormLabel>Last Name</FormLabel>
          <FormControl
            type="text"
            as="input"
            name="lastname"
            value={formData?.lastname}
            onChange={handleChange}
          />
          <FormLabel>Address</FormLabel>
          <FormControl
            type="text"
            as="input"
            name="address"
            value={formData?.address}
            onChange={handleChange}
          />
          <FormLabel>Phone</FormLabel>
          <FormControl
            type="phone"
            as="input"
            name="phone"
            required={true}
            value={formData?.phone}
            onChange={handleChange}
          />
        </FormGroup>
        <Button
          type="submit"
          variant={'primary'}
        >
          <span>
            {contact !== null
              ? 'Update Contact'
              : 'Create Contact'
            }
          </span>
        </Button>
        {Boolean(contactFetched) && !user && (
          <Button onClick={() => {
            setNavigateProfile(true);
            console.log('set profile navigation: ', true);

          }}>
          <span>
            <label>Go to Profile</label>
          </span>
          </Button>
          /*  <Profile
              contact={contact}
              userid={userId}
            />*/
        )}

      </Form>
      {
        isUpdated &&
        <span className={'text-3xl text-green-400'}>Updated!</span>
      }
    </Container>
  )
}

export default Contact;