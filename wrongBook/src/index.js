/*
 * @Author: your name
 * @Date: 2020-09-07 09:39:59
 * @LastEditTime: 2020-09-15 16:49:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\index.js
 */

import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/login').default);
app.model(require('./models/workManage').default);
app.model(require('./models/homePage').default);
app.model(require('./models/classHome').default);
app.model(require('./models/userInfo').default);
app.model(require('./models/temp').default);
app.model(require('./models/report').default);
app.model(require('./models/down').default);
app.model(require('./models/example').default);
app.model(require('./models/reportChart').default);
app.model(require('./models/correction').default);
app.model(require('./models/market').default);
app.model(require('./models/classModel').default);
// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

