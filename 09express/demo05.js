const express = require('express');
const app = new express();

app.use(express.json());
app.use((req, res) => {
  console.log('req,res', req.body);
  res.send(req.body);
});
app.listen(3000, () => {
  console.log('server is listening on 3000');
});
