import React, {useEffect, useState} from 'react';
import {getContact, saveTagInformation, updateContact} from "../api/tagApi";
import {isEmpty} from "lodash";
import QrcodeData from "./Qrcode";
import {useParams} from 'react-router-dom';

function Contact() {
    const userid = useParams();
    const [allFieldsSet, setAllFieldsSet] = useState(false);
    const [contact, setContact] = useState({});
    const [needsCreated, setNeedsCreated] = useState(false);
    const [saved, setSaved] = useState(false);
    const [update, setUpdate] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    /*
        const {userid} = useParams();
    */
    console.log('route: ', userid);
    const [formData, setFormData] = useState({
        userid: userid.userid || '',
        petname: '',
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
    }, [formData, allFieldsSet, saved, needsCreated, update, isUpdated]);

    /*  useEffect(() => {
          if (userid && update) {
              try {
                  updateContact(formData)
                      .then(res => {
                          console.log(res);
                          if (res?.Updated === true) {
                              setIsUpdated(true);
                          }
                      });
              } catch (err) {
                  console.log(err);
              }
          } 
      }, [update, userid]);*/

    useEffect(() => {
        if (userid) {
            try {
                getContact(userid)
                    .then(res => {
                        console.log(res);
                        if (!res.data.userid) {
                            setNeedsCreated(true);
                        } else if (res.data.userid) {
                            setFormData(res.data);
                            setUpdate(true);
                        }
                    });
            } catch (err) {
                console.log(err);
            }
        }

    }, [contact, userid]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEmpty(formData.userid)
            && !isEmpty(formData.firstname)
            && !isEmpty(formData.petname)
            && (!isEmpty(formData.phone) && !isEmpty(formData.address))
        ) {
            const request = {
                userid: formData.userid,
                ...formData
            };
            console.log('request', request);
            if (update) {
                try {
                    updateContact(formData)
                        .then(res => {
                            console.log(res);
                            if (res?.Updated === true) {
                                setIsUpdated(true);
                            }
                        });
                } catch (err) {
                    console.log(err);
                }
            } else if (!update) {
                saveTagInformation(request)
                    .then(res => {
                        console.log(res);
                        setSaved(true);
                    }).catch(err => console.error(err));
            }
        } else {
            setAllFieldsSet(false);
        }
    };


    return (
        <div className="flex items-center justify-center pt-5">
            <div className="p-6 max-w-md w-full bg-white rounded-md shadow-lime-500">
                <h1 className="text-2xl text-red-600 font-bold mb-8">Dog Tag QR Generator</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700">Pet Name</label>
                        <input
                            type="text"
                            name="petname"
                            required={true}
                            value={formData.petname}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">First Name</label>
                        <input
                            required={true}
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            required={true}
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        {update === true ? 'Update' : 'Create Contact Info'}
                    </button>
                </form>
            </div>
            {saved &&
                <div>
                    <QrcodeData userid={userid}/>
                    <span className={'text-3xl text-green-400'}>Saved!</span>
                </div>
            }
            {
                isUpdated &&
                <span className={'text-3xl text-green-400'}>Updated!</span>
            }
        </div>
    )
        ;
}

export default Contact;