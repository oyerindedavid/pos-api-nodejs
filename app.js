require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const  product = require('./endpoint/v1/product');
const  category = require('./endpoint/v1/category');
const  supplier = require('./endpoint/v1/supplier');
const  tag = require('./endpoint/v1/tag');
const  stock = require('./endpoint/v1/stock');
const  brand = require('./endpoint/v1/brand');
const  account = require('./endpoint/v1/account');
const  staff = require('./endpoint/v1/staff');
const  sales = require('./endpoint/v1/sales');
const  user = require('./endpoint/v1/user');
const  basket = require('./endpoint/v1/basket');
const  customer = require('./endpoint/v1/customer');
const  locationArea = require('./endpoint/v1/location-area');
const  device = require('./endpoint/v1/device');
const  deviceGroup = require('./endpoint/v1/device-group');
const  posModule = require('./endpoint/v1/module');
const AppError = require('./utils/appError');

app.use(cors());
app.options('*', cors()) 
  
app.get('/', (req, res) => {
   res.status(200).send(`Hello World!`);
});

app.use('/api/v1/account', account);
app.use('/api/v1/user', user);
app.use('/api/v1/staff', staff);
app.use('/api/v1/sales', sales);
app.use('/api/v1/product', product);
app.use('/api/v1/category', category);
app.use('/api/v1/supplier', supplier);
app.use('/api/v1/brand', brand);
app.use('/api/v1/tag', tag);
app.use('/api/v1/stock', stock);
app.use('/api/v1/basket', basket);
app.use('/api/v1/customer', customer);
app.use('/api/v1/locationarea', locationArea);
app.use('/api/v1/device', device);
app.use('/api/v1/devicegroup', deviceGroup);
app.use('/api/v1/posmodule', posModule)

app.all('*', (req, res, next) => {
  const err = new AppError(`Requested URL ${req.path} not found!`, 404, 'URL not found', 0);
  next(err)
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success : 0,
    message : err.message,
    stack : err.stack
  })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});