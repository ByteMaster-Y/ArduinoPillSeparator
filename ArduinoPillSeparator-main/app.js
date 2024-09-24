const express = require('express'); 
// Express 모듈을 가져옵니다. Express는 Node.js를 위한 웹 프레임워크로, HTTP 서버를 쉽게 구축할 수 있게 해줍니다.
const nunjucks = require('nunjucks');
//  Nunjucks 모듈을 가져옵니다. Nunjucks는 Jinja2에서 영감을 받은 JavaScript 템플릿 엔진으로, 서버 측에서 HTML을 렌더링하는 데 사용됩니다.
const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});
// Express 애플리케이션을 생성합니다. 이 app 객체를 통해 다양한 미들웨어와 라우트를 설정합니다.

// assets의 들어오는 모든 건 이친구가 한다.!
// __dirname이 실행되는 경로를 나타낸다.! 
// + /assets 추가경로를 찾아준다.
app.use('/assets', express.static(__dirname + '/assets'));

indexRouter = require('./router/home');
alarmRouter = require('./router/alarm');
// memberRouter = require('./router/member');

app.use('/', indexRouter);
app.use('/alarm', alarmRouter);
// app.use('/member', memberRouter);

// 처음에 / 주소, 그다음에 함수 ()

//404 not found!
app.use((req,res) => {
    console.log('여기');
    res.status(404).send('404 NOT FOUND!');
}); // 얘를 쓰면 전부 걸림

app.listen(80, () => {
    console.log('80번 포트에서 express서버 대기중..');
});

//npm run dev만 설치하면 계속 서버 리로딩 안해도된다~
//npm install nodemon 
//npm install -> real로 할 때

// 넌적스에서 strong줄 때 조심 
// 마지막 파이프라인에서 safe줘야한다.

// npx nodemon app.js
// npm run dev