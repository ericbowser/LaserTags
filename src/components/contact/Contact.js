import React, { useEffect, useState } from "react";
import { getContact, saveContact, updateContact } from "../../api/tagApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/Auth0/Authorize";
import { isEmpty } from "lodash";
import DarkModeToggle from "../theme/DarkModeToggle";

const Contact = () => {
  const { user, isAuthenticated, saveContactToAuth0 } = useAuth();
  const { userid } = useParams();
  console.log("userid passed in from params: ", userid);

  const [needsCreated, setNeedsCreated] = useState(null);
  const [navigateProfile, setNavigateProfile] = useState(false);
  const [allFieldsSet, setAllFieldsSet] = useState(false);
  const [saved, setSaved] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {}, [allFieldsSet, saved, contact]);

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
      ...contact,
    };
    console.log("request", request);
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
        console.log("Saved Response: ", contact);
        setSaved(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel dark:bg-gradient-pastel-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="bg-pastel-cream dark:bg-dark-surface rounded-2xl shadow-xl overflow-hidden border border-pastel-lavender/30 dark:border-dark-border/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-pastel-coral to-pastel-rose dark:from-pastel-mauve dark:to-pastel-lilac px-8 py-6 relative">
            <div className="absolute top-4 right-4">
              <DarkModeToggle />
            </div>
            <h1 className="text-3xl font-bold text-white text-center">
              Dog Tag QR Generator
            </h1>
            <p className="text-white/90 text-center mt-2">
              Create a digital identity for your pet
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mx-8 mt-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {isUpdated && (
            <div className="mx-8 mt-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Contact updated successfully!
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            className="px-8 py-8 space-y-6"
            id="contact-form"
            name="contact-form"
            onSubmit={handleSubmit}
          >
            {/* Pet Name */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2"
              >
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact"
                type="text"
                name="petname"
                required={true}
                value={contact?.petname || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pastel-lavender/40 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-pastel-coral dark:focus:ring-pastel-rose focus:border-transparent transition duration-200 ease-in-out hover:border-pastel-coral dark:hover:border-pastel-rose bg-white dark:bg-dark-surfaceLight text-gray-800 dark:text-dark-text"
                placeholder="Enter your pet's name"
              />
            </div>

            {/* First Name */}
            <div>
              <label
                htmlFor="contact_firstname"
                className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact_firstname"
                required={true}
                type="text"
                name="firstname"
                value={contact?.firstname || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pastel-lavender/40 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-pastel-coral dark:focus:ring-pastel-rose focus:border-transparent transition duration-200 ease-in-out hover:border-pastel-coral dark:hover:border-pastel-rose bg-white dark:bg-dark-surfaceLight text-gray-800 dark:text-dark-text"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="contact_lastname"
                className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2"
              >
                Last Name
              </label>
              <input
                id="contact_lastname"
                type="text"
                name="lastname"
                value={contact?.lastname || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pastel-lavender/40 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-pastel-coral dark:focus:ring-pastel-rose focus:border-transparent transition duration-200 ease-in-out hover:border-pastel-coral dark:hover:border-pastel-rose bg-white dark:bg-dark-surfaceLight text-gray-800 dark:text-dark-text"
                placeholder="Enter your last name"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="contact_address"
                className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2"
              >
                Address
              </label>
              <input
                id="contact_address"
                type="text"
                name="address"
                value={contact?.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pastel-lavender/40 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-pastel-coral dark:focus:ring-pastel-rose focus:border-transparent transition duration-200 ease-in-out hover:border-pastel-coral dark:hover:border-pastel-rose bg-white dark:bg-dark-surfaceLight text-gray-800 dark:text-dark-text"
                placeholder="Enter your address"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="contact_phone"
                className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="contact_phone"
                type="tel"
                name="phone"
                required={true}
                value={contact?.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pastel-lavender/40 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-pastel-coral dark:focus:ring-pastel-rose focus:border-transparent transition duration-200 ease-in-out hover:border-pastel-coral dark:hover:border-pastel-rose bg-white dark:bg-dark-surfaceLight text-gray-800 dark:text-dark-text"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                id="submit-contact"
                name="submit"
                type="submit"
                className="w-full bg-gradient-to-r from-pastel-coral to-pastel-rose dark:from-pastel-mauve dark:to-pastel-lilac text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-coral dark:focus:ring-pastel-rose transform transition duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
              >
                {contact !== null ? "Update Contact" : "Create Contact"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
