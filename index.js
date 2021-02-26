// express module 가져오기
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')

const config = require('./config/key')

const { User } = require("./models/User")

//application/x-www-form-urlendcoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 새해 복 많이 받으세요!'))

// register router
app.post('/register', (req, res) => {
    // 회원가입 시 필요한 정보들을 client에서 가져오면 
    // 그 정보를 데이터베이스에 넣어주는 함수
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({sucess: false, err})
        return res.status(200).json({
            sucess: true
        })
    })
})

// 앱이 실행되면 => 해라
app.listen(port, () => console.log(`Example app listening on port ${port}`))
