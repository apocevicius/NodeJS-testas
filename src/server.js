const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {showBody} = require('./utils/middleware')
const { port } = require('./config');


const PORT = process.env.SERVER_PORT || 3000;

const app = express();

// Middleware
app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use(showBody)

app.get('/', (req, res) => {
  res.send('Hello express');
});

// Routes
const userRoutes = require('./routes/v1/users');
const accountRoutes = require('./routes/v1/accounts');


// Use Routes
app.use('/users', userRoutes)
app.use('/accounts', accountRoutes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
