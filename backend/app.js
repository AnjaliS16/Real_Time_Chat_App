const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

require('dotenv').config()

app.use(bodyParser.json());


const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), { flags: 'a' }
);


app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors({
    origin : 'http://54.159.189.58:3005',
    methods : [' GET' ,'POST','DELETE']
}))

app.use(express.static(path.join(__dirname, 'frontend')));

const sequelize = require('./util/database');
const Message = require('./model/message.js')
const User = require('./model/user.js')
const Group = require('./model/group.js')
const Member = require('./model/member.js')
const Forgotpassword = require('./model/forgotpassword.js')



const user = require('./routes/user.js');
const message = require('./routes/message.js')
const group = require('./routes/group.js')
const admin = require('./routes/admin.js')
const forgotpassword = require('./routes/forgotpassword.js')


app.use(user);
app.use(message);
app.use(group);
app.use(admin);
app.use(forgotpassword);


app.use((req, res, next) => {

    const filePath = req.url.split('?')[0];
    const fullPath = path.join(__dirname, 'frontend', filePath);

    res.sendFile(fullPath, (err) => {
        if (err) {
            console.error(`Error sending file: ${fullPath}`);
            next(err);
        }
    });
})


User.belongsToMany(Group, { through: Member })
Group.belongsToMany(User, { through: Member })

Group.hasMany(Message)
Message.belongsTo(Group)

Member.hasMany(Message)
Message.belongsTo(Member)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


sequelize.sync()
    .then(() => {
        app.listen(5500, () => {
            console.log('server running on port 6900')
        });
    })
    .catch((err) => {
        console.log('error while connecting database:', err);
    })
