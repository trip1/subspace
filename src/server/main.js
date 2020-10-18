const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.static('dist'));
 
app.listen(PORT, () => {
    console.log('App listening on:', PORT);
})