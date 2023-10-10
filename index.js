
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: `https://covid-dashboard-front-end.onrender.com`,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(router);
app.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
