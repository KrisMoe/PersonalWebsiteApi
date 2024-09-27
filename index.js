
require('dotenv').config(); 
const express = require('express')
const app = express()
const port = process.env.PORT;
const itemsPool = require('./dbConfig');
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
})


app.get('/api/items', async(req, res) => {
  try {
      const allItems = await itemsPool.query(
          'SELECT * FROM items'
      );
      res.json({ allItems });
  } catch (error) {
      console.log(error);
      res.status(500).send(error.message)
  }
})
app.post('/api/items', async (req, res) => {
  const { description } = req.body;
  try {
      const newItem = await itemsPool.query(
          'INSERT INTO items (description) VALUES ($1) RETURNING *',
          [description]
      );
      res.json({ 
          message: "New item added!",
          item: newItem.rows
       });
  } catch (error) {
      console.log(error);
      res.status(500).send(error.message)
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}.  `)
})


