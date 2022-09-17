const express = require('express');
const User = require('./models/User');
const Product = require('./models/Product');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { is_signed_in, is_not_signed_in } = require('./middleware/auth_middleware');
const db = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000
const app = express();

//Connect to DB
mongoose.connect(db)
  .then(() => console.log('MongoDb Connected...'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

app.engine("html", require("ejs").renderFile);

app.get('/', async(req, res) => {
  res.render("index.html");
})

app.get('/register', is_not_signed_in, async(req, res) => {
  res.render("register.html");
})

app.get('/profile', is_signed_in, async(req, res) => {
  res.render("profile.html");
})

app.use('/api/users', require('./routes/user_routes'))

app.get('/verify/:uniqueString', async(req, res) => {
  const { uniqueString } = req.params;

  const user = await User.findOne({ unique_string: uniqueString });

  if (user) {
      user.confirmed = true;
      await user.save();
      res.render('confirmation.html')
    } else {
      res.json('User not found');
  }
});

const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose');

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
})

const start = async () => {
  const adminOptions = {
    resources: [User, Product],
  }

  const admin = new AdminJS({
    databases: [mongoose],
  })

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()