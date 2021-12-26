const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// config file
dotenv.config({ path: './config.env' });

// express json parser middleware
app.use(express.json());
// middleware -> to serve static files like css to the browser
app.use(express.static('public'));
// cookie middleware
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(connection =>
    console.log(
      `Connection to your local mongodb(${connection.connections[0].host}) is successful.`
    )
  )
  .catch(err => console.log(err));

// server
// console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// main app routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
// auth routes
app.use(authRoutes);

// // cookies
// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('Set-Cookie', 'newUser=true');

//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   });

//   res.send('You got the cookies!');
// });

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);

//   res.json(cookies);
// });
