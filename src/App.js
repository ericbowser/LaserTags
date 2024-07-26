import React, {useEffect, useState} from 'react';
import QrcodeData from './components/Qrcode';
import {isEmpty} from "lodash";
import { useParams } from 'react-router-dom';
import {saveTagInformation} from './api/tagApi';
import './output.css';

const App = () => {
    const [allFieldsSet, setAllFieldsSet] = useState(false);
    const [saved, setSaved] = useState(false);
    const {userid} = useParams();
    const [formData, setFormData] = useState({
        userid: userid || '',
        petname: '',
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
    });
    console.log(formData);

    useEffect(() => {
    }, [formData, allFieldsSet, saved]);

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
            saveTagInformation(formData)
                .then(res => {
                    console.log(res);
                    setSaved(true);
                }).catch(err => console.error(err));
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
                        Generate QR Code
                    </button>
                </form>
            </div>
            {saved &&
                <QrcodeData userid={userid}/>
            }
        </div>
    );
};

export default App;