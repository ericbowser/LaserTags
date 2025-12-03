import axios from 'axios';
import {ASSIST_EMAIL_URL} from '../../env.json';

async function sendEmail(emailParams = {}) {
    const {from, to, subject, message} = emailParams;
    console.log('email url: ', ASSIST_EMAIL_URL)
    try {
        const response = await axios.post(
            ASSIST_EMAIL_URL,
            {
                from: from,
                to: to,
                subject: subject,
                message: message
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            }
        );
        
        console.debug(response.status);
        return response;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default sendEmail;