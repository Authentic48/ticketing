import express from 'express';

const app = express();

app.get('/api/auth/login', (req, res) => {
  res.json("It's working !!!");
});

app.listen(5000, () => {
  console.log('App is running on port 5000 !!!!');
});
