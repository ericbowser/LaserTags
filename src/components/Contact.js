import React, {useEffect, useState} from 'react';
import {getContact, saveContact, updateContact} from "../api/tagApi";
import {isEmpty} from "lodash";
import QrcodeData from "./Qrcode";
import {useParams} from 'react-router-dom';

const Contact = () => {
    const {userid} = useParams();
    console.log('user id: ', userid);
    const [allFieldsSet, setAllFieldsSet] = useState(false);
    const [needsCreated, setNeedsCreated] = useState(null);
    const [saved, setSaved] = useState(false);
    const [update, setUpdate] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [userId, setUserId] = useState(userid.toString());
    /*
        const {userid} = useParams();
    */
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
        if (contact.status === 204) {
            setNeedsCreated(true);
        } else if (contact.status === 201) {
            setNeedsCreated(false);
            setFormData(contact.data.contact);
            setUserId(contact.data.userid);
            setUpdate(true);
            console.log('set user id: ', contact.data.userid);
        }
    }

    useEffect(() => {
        const formData = checkFormData();
        if (!formData && userId) {
            queryContact().then(r => setCurrentContact(r));
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
                saveContact(request)
                    .then(res => {
                        console.log('Saved Response: ', res);
                        setSaved(true);
                        setUserId(res.userid);
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
                            type="phone"
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
}

export default Contact;