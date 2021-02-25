// express module 가져오기
const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => res.send('Hello World! 하이하이!'))
// 앱이 실행되면 => 해라
app.listen(port, () => console.log(`Example app listening on port ${port}`))
