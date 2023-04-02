const {sendEmail} = require('../controllers/mail.controller');

const postEmail = async (req, res) => {
    const token = req.cookies.refreshToken
    console.log(token)
    try { 
        /* const email = await sendEmail(token) */
        res.status(201).json(email);
    } catch (error) {
        res.status(400).json({ error: "Error Posting Email", message: error });
    }
};

module.exports = {postEmail}