import express from 'express';
const app = express();

// Endpoint for the list of cities
app.get('/cities', function (req, res) {
  const cities = ['City1', 'City2', 'City3']; // Replace with your actual list of cities
  res.json({ cities });
});

// Endpoint for the list of names
app.get('/names', function (req, res) {
  const names = ['Name1', 'Name2', 'Name3']; // Replace with your actual list of names
  res.json({ names });
});

app.get('/posts', async (req, res) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')  // Replace with your actual list of names
    const data = await response.json()
    res.json({ data });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



