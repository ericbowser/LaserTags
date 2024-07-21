import React, {useEffect, useState} from 'react';
import QrcodeData from './components/Qrcode';
import {isEmpty} from "lodash";
import './output.css';

const App = () => {
    const [allFieldsSet, setAllFieldsSet] = useState(false);
    const [formData, setFormData] = useState({
        username: 'ericbo',
        password: 'Test123',
        firstname: '',
        lastname: '',
        petname: '',
        phone: '',
        address: '',
        city: '',
        state: ''
    });

    useEffect(() => {
    }, [formData, allFieldsSet]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEmpty(formData.firstname)
            && !isEmpty(formData.lastname)
            && !isEmpty(formData.petname)
            && !isEmpty(formData.phone)
            && !isEmpty(formData.city)
            && !isEmpty(formData.state)
            && !isEmpty(formData.address)) {
            setAllFieldsSet(true);
        }
    };

    return (
        <div className="flex items-center justify-center pt-5">
            <div className="p-6 max-w-md w-full bg-white rounded-md shadow-lime-500">
                <h1 className="text-2xl text-red-600 font-bold mb-8">Dog Tag QR Generator</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Pet Name</label>
                        <input
                            type="text"
                            name="petname"
                            value={formData.petname}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            required={true}
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
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
            {allFieldsSet &&
                <QrcodeData formData={formData}/>
            }
        </div>
    );
};

export default App;