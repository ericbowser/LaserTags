import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import QRCode from 'qrcode';

const QrcodeData = ({ userid }) => {
    const [savedUrl, setSavedUrl] = useState(null);
    const [qrCodeImage, setQrCodeImage] = useState(null);
    
    async function getUrl() {
        try {
            if (userid) {
                console.log('returned url: ', userid);
                const baseUrl = window.location.origin;
                setSavedUrl(`${baseUrl}/contact/${userid}`);
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    useEffect(() => {
        if (!savedUrl && userid) {
            getUrl().then(r => console.log(r));
        }
    }, [userid, savedUrl]);

    useEffect(() => {
        if (savedUrl) {
            QRCode.toDataURL(savedUrl, {
                width: 150,
                margin: 2,
                errorCorrectionLevel: 'M',
                color: {
                    dark: '#00FF00', // Green color
                    light: '#FFFFFF'
                }
            }).then(dataUrl => {
                const img = new window.Image();
                img.src = dataUrl;
                img.onload = () => {
                    setQrCodeImage(img);
                };
            }).catch(error => {
                console.error('Error generating QR code:', error);
            });
        }
    }, [savedUrl]);
   
    return (
        <div>
            {qrCodeImage && (
                <div className="mt-8">
                    <Stage width={150} height={150}>
                        <Layer>
                            <KonvaImage
                                image={qrCodeImage}
                                width={150}
                                height={150}
                            />
                        </Layer>
                    </Stage>
                </div>
            )}
        </div>
    );
};

export default QrcodeData;