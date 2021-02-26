// mongoose 가져오기
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

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
        maxlength: 50
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
        if(err) return cb(err),
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema);

// 다른 곳에서도 사용할 수 있게
module.exports = {User}