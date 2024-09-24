const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const checkUserPermissions = require('./utils/auth');
const timeMiddleware = require('./utils/timeMiddleware'); // 引入时间中间件

// 设置静态资源目录
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 中间件
app.use(cors()); //跨域
app.use(bodyParser.json()); // 解析json
// 使用 body-parser 中间件来解析 application/x-www-form-urlencoded 格式的数据
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 解析cookie
app.use(checkUserPermissions); //权限验证
app.use(timeMiddleware); // 处理时间


// 路由
const userRouter = require('./routes/userRouter');
const competitionRoutes = require('./routes/competitionsRouter');
const registrationRoutes = require('./routes/registrationRouter');
const submissionRoutes = require('./routes/submissionRouter');

app.use('/users', userRouter);
app.use('/competitions', competitionRoutes);
app.use("/registrations",registrationRoutes);
app.use("/submissions",submissionRoutes);

const port = process.env.PORT || 2531;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
