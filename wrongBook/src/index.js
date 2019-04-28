
import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/login').default);
app.model(require('./models/homePage').default);
app.model(require('./models/classHome').default);
app.model(require('./models/userInfo').default);
app.model(require('./models/temp').default);
app.model(require('./models/report').default);
app.model(require('./models/down').default);
app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

