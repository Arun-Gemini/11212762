const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');

const port = process.env.PORT || 3000;

app.use('/api', productRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
