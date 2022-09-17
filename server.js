const express = require('express');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order')
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

//Verify UniqueString for every user
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

//Checkout orders in the cart
app.post('/checkout', function(req, res, next) {
  if (!req.session.cart) {
    return res.json({ error: 'cart is empty' });
  }
  var myCart = new Cart(req.session.cart);
  
  //Somehow pay things in the cart 

  const payment_id = 0; //some id generated in payment process
  const myUser = req.cookies["user"];

  var order = new Order({
    user: myUser,
    cart: myCart,
    payment_id: payment_Id
  })

  order.save(); // save orders to order database
})

// Admin Panel
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose');
const Cart = require('./models/Cart');

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