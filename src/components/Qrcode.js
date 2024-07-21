import QRCode from 'qrcode.react';
import React, {useEffect, useState} from 'react';
import saveTagInformation from '../api/tagApi';

const QrcodeData = ({formData}) => {
    // TODO - get login userid and password to use as unique url
    console.log('form data: ', formData);
    const [savedUrl, setSavedUrl] = useState(null);
    const body = {
        username: formData.username,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        petname: formData.petname,
        phone: formData.phone,
        address: formData.phone,
        city: formData.city,
        state: formData.state
    }
    
    async function getUrl() {
        try {
            const url = await saveTagInformation(body);
               /* .then(res => {
                    console.log(res);
                    if (res) {
                        setSavedUrl('https://erb-think.com');
                    }
                    return url;
                });*/
            if(url) {
                console.log('returned url: ', url);
                setSavedUrl('http://localhost:');
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    useEffect(() => {
        if(!savedUrl) {
          getUrl().then(r => console.log(r))
        }
    }, [savedUrl])
   
    return (
        <>
            <div>
                {savedUrl &&
                    <div className="mt-8">
                        <QRCode
                            value={savedUrl}
                            color={'green'}
                            size={150}
                        />
                    </div>
                }
            </div>
        </>
    )
}

export default QrcodeData;