import React from 'react';
import { Router, Route,Switch  } from 'dva/router';
// import ComponentWarp from '../../components/ComponentWarp';

import Login from './routes/Login/loginPage';
import ClassAdmin from './routes/GradeAdmin/ClassAdmin/classAdmin'
import GradeAdmin from './routes/GradeAdmin/gradeAdmin';
import Home from './routes/Layout/Menus'
import SchoolAdmin from './routes/SchoolAdmin/SchoolList/SchoolList'
import SchoolNews from './routes/SchoolAdmin/SchoolNews/SchoolNews'
import AddClass from './routes/GradeAdmin/ClassAdmin/addClass'
import UserList from './routes/Userlist/UserList'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>

        <Route path="/login"  component={Login} />

        <Home>
          {/* <Route path="/" component={IndexPage} /> */}
          <Route path="/grade" component={GradeAdmin} />
          <Route path="/class" component={ClassAdmin} />
          <Route path="/addclass" component={AddClass} />

          
          <Route path="/school" component={SchoolAdmin} />
          <Route path="/schoolNews" component={SchoolNews} />


          <Route path="/user" component={UserList} />

          

        </Home>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
