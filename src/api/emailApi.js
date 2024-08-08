import axios from 'axios';

async function sendEmail(emailParams = {}) {
    const {from, subject, message} = emailParams;
    console.log('email url: ', process.env.ASSIST_EMAIL_URL)
    try {
        const response = await axios.post(
            process.env.ASSIST_EMAIL_URL,
            {
                subject: subject,
                from: from,
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