// mongoose 가져오기
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// user 스키마를 저장하기 전에 동작하는 함수
userSchema.pre('save', function (next) {
    var user = this;
    // 비밀번호를 변경할 시에만 작동 (다른 정보를 바꿀 시에는 실행 X)
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {  // 비밀번호 변경이 아닌 경우
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword - 1234567  암호화된 비밀번호 - $2b$10$QboRZ/mW26t1fk2Bq.ravuJL7UJR/JUxf088FXvLY/ZvmC6M1/PJG
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    //jsonwebtoken 라이브러리 이용해서 token 생성하기
    // user._id + secretToken = token
    // 나중에 secretToken을 조회하면 user._id 가 나온다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user의 token으로 변경해주기
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
} 

userSchema.static.findByToken = function(token, cb) {
    var user = this;

    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // user id 를 이용해 유저를 찾은 다음,
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

// 다른 곳에서도 사용할 수 있게
module.exports = {User}