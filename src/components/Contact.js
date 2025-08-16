import React, {useEffect, useState} from 'react';
import {getContact, saveContact, updateContact} from "../api/tagApi";
import {useParams} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {useAuth} from "./Auth0/Authorize";
import {Alert} from "react-bootstrap";
import {isEmpty} from "lodash";

const Contact = () => {
  const {user, isAuthenticated, saveContactToAuth0} = useAuth();
  const {userid} = useParams();
  console.log('userid passed in from params: ', userid);

  const [needsCreated, setNeedsCreated] = useState(null);
  const [contactFetched, setContactFetched] = useState(null);
  const [navigateProfile, setNavigateProfile] = useState(false);
  const [allFieldsSet, setAllFieldsSet] = useState(false);
  const [saved, setSaved] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
  }, [allFieldsSet, saved, contactFetched, contact]);

  /* useEffect(() => {
     if (isAuthenticated && user) {
       const auth0UserId = user.sub.split('|')[1];
       getContact(auth0UserId).then(contact => {
         if (contact.exists) {
           setContact(contact.contact);
           setError(null);
         } else {
           setNeedsCreated(true);
           setError(null);
         }
       }).catch(error => {
         console.log(error);
         setError(error);
       });
     }
   }, [isAuthenticated, user]);
 */
  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  function setCurrentContact(contact) {
    setNeedsCreated(false);
    setContact(contact);
    setError(null);
  }

  /* const handleSubmit = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);
     setError(null);
     setSaved(false);
 
     try {
       // Validate form data
       if (!contact.petname || !contact.firstname || !contact.phone || !contact.address) {
         setError('Please fill out all required fields');
         setIsSubmitting(false);
         return;
       }
       // Save data to Auth0 user metadata
       await saveContactToAuth0(contact);
       await saveContact(contact);
       setSaved(true);
     } catch (err) {
       console.error('Error saving contact:', err);
       setError('Failed to save contact information. Please try again.');
     } finally {
       setIsSubmitting(false);
     }
   };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    const request = {
      userid,
      ...contact
    };
    console.log('request', request);
    if (update) {
      try {
        const updateResponse = await updateContact(contact);
        if (updateResponse) {
          setIsUpdated(true);
        }
      } catch (err) {
        console.log(err);
        setError(err);
      }
    } else {
      const contact = await saveContact(request);
      if (contact) {
        console.log('Saved Response: ', contact);
        setSaved(true);
      }
    }
  }

  return (
    <div>
      {error &&
        <Alert id={'error'} name={'Error'} variant={'danger'}>
          {error}
        </Alert>
      }
      <form className={'contact-form'}
            id={'contact-form'}
            name={'contact-form'}
            onSubmit={handleSubmit}>
        <h1>Dog Tag QR Generator</h1>
        <div>
          
        <span>

            <label id={'petname_label'}>Pet Name</label>
            <input
              id={'contact'}
              type="text"
              name="petname"
              required={true}
              value={contact?.petname}
              onChange={handleChange}
            />
          </span>
        </div>
        <div>
          
        <span>

            <label id={'firstname_label'}>First Name</label>
            <input
              id={'contact_firstname'}
              required={true}
              type="text"
              name="firstname"
              value={contact?.firstname}
              onChange={handleChange}
            />
        </span>
        </div>
        <div>
          
        <span>
            <label id={'lastname_label'}>Last Name</label>
            <input
              id={'contact_lastname'}
              type="text"
              name="lastname"
              value={contact?.lastname}
              onChange={handleChange}
            />
          </span>
        </div>
        <div>
          
        <span>
          <label id={'address_label'}>Address</label>
          <input
            id={'contact_address'}
            type="text"
            name="address"
            value={contact?.address}
            onChange={handleChange}
          />
          </span>
        </div>
        <div>
          
        <span>
          <label id={'phone_label'}>Phone</label>
          <input
            id={'contact_phone'}
            type="phone"
            name="phone"
            required={true}
            value={contact?.phone}
            onChange={handleChange}
          />
        </span>
        </div>
        <div>

          <Button
            id={'submit-contact'}
            name={'submit'}
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
        </div>
        {/* <span>
            <label>Go to Profile</label>
          </span>*/}
      </form>
      {
        isUpdated &&
        <span id={'updated'} name={'updated'} className={'text-3xl text-green-400'}>Updated!</span>
      }
    </div>
  )
}

export default Contact;