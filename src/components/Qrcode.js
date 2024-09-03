import QRCode from 'qrcode.react';
import React, {useEffect, useState} from 'react';
import saveContact from '../api/tagApi';

const QrcodeData = (userid) => {
    const [savedUrl, setSavedUrl] = useState(null);
    
    async function getUrl() {
        try {
            if(userid) {
                console.log('returned url: ', userid);
                setSavedUrl(`http://localhost:31666/${userid}`);
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