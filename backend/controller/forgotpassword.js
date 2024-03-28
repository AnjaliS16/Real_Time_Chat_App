const uuid = require('uuid');

const bcrypt = require('bcrypt');
require('dotenv').config()
const sequelize = require('../util/database')

var SibApiV3Sdk = require('sib-api-v3-sdk');
const User = require('../model/user');
const Forgotpassword = require('../model/forgotpassword');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;



const forgotpassword = async (req, res) => {
    try {
        const id = uuid.v4();
        const email = req.body.email
        const user = await User.findOne({ where: { email: email } }, {
            include: [
                { model: Forgotpassword }
            ]
        })
        user.createForgotpassword({ id, isActive: true })
            .catch(err => {
                throw new Error(err)
            })
        console.log(user)
        console.log(user == null)
        if (user === null)
            return res.status(404).json({ success: false, msg: "Email not found" })

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        const sendSmtpEmail = {
            sender: {
                email: 'anjalisonwane518@gmail.com',
                name: 'Anjali',
            },
            to: [
                {
                    email: req.body.email,
                    name: 'anu',
                },
            ],
            subject: 'Test email',
            textContent: 'This is a test email sent via the Sendinblue Beta API.',
            htmlContent: `<a href="http://54.159.189.58:3005/resetpassword.html?reset=${id}">click here</a>`,
        };

        apiInstance
            .sendTransacEmail(sendSmtpEmail)
            .then((data) => {
                console.log('API called successfully. Returned data: ' + JSON.stringify(data, null, 2));
            })
            .catch((error) => {
                console.error(error);
            });
        return res.status(200).json(sendSmtpEmail)

    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }

};


const resetpassword = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const resetId = req.params.resetId;
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword

        const resetUser = await Forgotpassword.findByPk(resetId)
        if (!resetUser.isActive) {
            return res.status(401).json({ success: false, msg: "link expired create a new one" })
        }
        if (newPassword !== confirmPassword)
            return res.status(403).json({ success: false, msg: "new and confirm password are different" })

        const user = await resetUser.getUser()
        const hash = await bcrypt.hash(newPassword, 10)

        await user.update({ password: hash }, { transaction: t })
        await resetUser.update({ isActive: false }, { transaction: t })

        await t.commit()

        return res.json({ success: true, msg: "Password changed successfully" })
    } catch (e) {
        console.log(e)
        await t.rollback()
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}


const updatepassword = async (req, res) => {
    try {
        const resetUser = await Forgotpassword.findByPk(req.params.resetId)
        return res.json({ isActive: resetUser.isActive })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }


}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}