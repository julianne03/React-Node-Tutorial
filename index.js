// express module 가져오기
const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://julianne:qawsedrftg@mongodbtest.0rhjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 하이하이!'))
// 앱이 실행되면 => 해라
app.listen(port, () => console.log(`Example app listening on port ${port}`))
