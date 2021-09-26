const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('public'));

// route to return static html files
app.get('/', (req, res) => 
{
    res.sendFile('./public/index.html', { root: __dirname });
});

// ui server is running in port 4000
app.listen(port, function()
{
    console.log('ui app running');
});