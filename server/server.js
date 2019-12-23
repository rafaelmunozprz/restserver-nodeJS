const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.get('/usuario', (req, res)=>{
    res.json('get Usuario')
})

app.post('/usuario', (req, res)=>{
    res.json('post Usuario')
})

app.put('/usuario/:id', (req, res)=>{
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/usuario', (req, res)=>{
    res.json('delete Usuario')
})


app.listen(3000, ()=>{
    console.log('Escuchado puerto: ', 3000);
});