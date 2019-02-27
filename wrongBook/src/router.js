import React from 'react';
import { Router, Route,Switch,  } from 'dva/router';
// import ComponentWarp from '../../components/ComponentWarp';
import { Icon} from 'antd';
import Login from './routes/Login/loginPage';
import ClassAdmin from './routes/GradeAdmin/ClassAdmin/classAdmin'
import GradeAdmin from './routes/GradeAdmin/gradeAdmin';
import Home from './routes/Layout/Menus'
import SchoolAdmin from './routes/SchoolAdmin/SchoolList/SchoolList'
import SchoolNews from './routes/SchoolAdmin/SchoolNews/SchoolNews'
import AddClass from './routes/GradeAdmin/ClassAdmin/addClass'
import UserList from './routes/Userlist/UserList'
import MyNews from './routes/Layout/userLeft'
import ClassInfo from './routes/GradeAdmin/ClassAdmin/classList'
// import WorkDetail from './routes/homeworkDetail/homeworkDetail'
import WorkDetail from './routes/workDetail/homeworkDetail'

import WorkInfo from './routes/homeworkDetail/workInfo'
import dynamic from 'dva/dynamic'

function RouterConfig({ history,app }) {
  const Login = dynamic({
    app,
    component: () => import('./routes/Login/loginPage')
  })
  
  const Home = dynamic({
    app,
    component: () => import('./routes/Layout/Menus')
  })
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login"  component={Login} />
        <Route path="/UserInfo" component={MyNews} />
        <Route path="/workInfo" component={WorkInfo} />
        <Route path="/classInfo" component={ClassInfo} />
          <Home>
            {/* <Route path="/" component={IndexPage} /> */}
            <Route path="/grade" component={GradeAdmin} />
            <Route path="/class" component={ClassAdmin} />
            <Route path="/addclass" component={AddClass} />
            <Route path="/school" component={SchoolAdmin} />
            <Route path="/schoolNews" component={SchoolNews} />
            <Route path="/user" component={UserList} />
            <Route path="/workDetail" component={WorkDetail} />
            
          </Home>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
