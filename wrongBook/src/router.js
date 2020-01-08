import React from 'react';
import { Router, Route, Switch, } from 'dva/router';
import Loadable from 'react-loadable';
import List from 'react-content-loader';


const Login = Loadable({
  loader: () => import('./routes/log/login'),
  loading: () => <List />,
});
const Getcode = Loadable({
  loader: () => import('./routes/log/getcode'),
  loading: () => <List />,
});
const LoginP = Loadable({
  loader: () => import('./routes/log/LoginPage'),
  loading: () => <List />,
});
const FindPsd = Loadable({
  loader: () => import('./routes/log/finPsd'),
  loading: () => <List />,
});
const GetPhone = Loadable({
  loader: () => import('./routes/log/getPhone'),
  loading: () => <List />,
});
const Home = Loadable({
  loader: () => import('./routes/Layout/Menus'),
  loading: () => <List />,
});
// const GradeAdmin = Loadable({
//   loader: () => import('./routes/GradeAdmin/gradeAdmin'),
//   loading: () => <List />,
// });
const ClassUser = Loadable({
  loader: () => import('./routes/GradeAdmin/ClassUser/classUser'),
  loading: () => <List />,
});
const ClassAdmin = Loadable({
  loader: () => import('./routes/GradeAdmin/ClassAdmin/classAdmin'),
  loading: () => <List />,
});
const AddClass = Loadable({
  loader: () => import('./routes/GradeAdmin/ClassAdmin/addClass'),
  loading: () => <List />,
});
const SchoolAdmin = Loadable({
  loader: () => import('./routes/SchoolAdmin/SchoolList/SchoolList'),
  loading: () => <List />,
});
const SchoolNews = Loadable({
  loader: () => import('./routes/SchoolAdmin/SchoolNews/SchoolNews'),
  loading: () => <List />,
});
const UserList = Loadable({
  loader: () => import('./routes/Userlist/UserList'),
  loading: () => <List />,
});
const StudentDetail = Loadable({
  loader: () => import('./routes/studentDetail/studentDetail'),
  loading: () => <List />,
});
const ClassReport = Loadable({
  loader: () => import('./routes/wrongReport/classReport/classReport'),
  loading: () => <List />,
});
const StuReport = Loadable({
  loader: () => import('./routes/wrongReport/stuReport/stuReport'),
  loading: () => <List />,
});
const WorkReport = Loadable({
  loader: () => import('./routes/wrongReport/workReport/workReport'),
  loading: () => <List />,
});
const UserInfo = Loadable({
  loader: () => import('./routes/UserInfo/information'),
  loading: () => <List />,
});
const SchoolChart = Loadable({
  loader: () => import('./routes/chart/schoolReportChart/schoolChart'),
  loading: () => <List />,
});
const ClassChart = Loadable({
  loader: () => import('./routes/chart/classReportChart/classChart'),
  loading: () => <List />,
});
const WrongTopic = Loadable({
  loader: () => import('./routes/SchoolAdmin/wrongTopic/wrongTopic'),
  loading: () => <List />,
});
const IntelligentDollors = Loadable({
  loader: () => import('./routes/intelligentDollors/intelligentDollors'),
  loading: () => <List />,
});
const userImport = Loadable({
  loader: () => import('./routes/SchoolAdmin/userImport/userImport'),
  loading: () => <List />,
});
const specialDownload = Loadable({
  loader: () => import('./routes/SchoolAdmin/specialDownload/specialDownload'),
  loading: () => <List />,
});

function RouterConfig({ history }) {

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/login" component={Login} />
        <Route path="/getcode" component={Getcode} />
        <Route path="/loginPhone" component={LoginP} />
        <Route path="/fin_psd" component={FindPsd} />
        <Route path="/getPhone" component={GetPhone} />
        {/* <Route path="/classInfo" component={ClassInfo} /> */}
        <Route path="/studentDetail" component={StudentDetail} />
        <Home>
          {/* <Route path="/grade" component={GradeAdmin} /> */}
          <Route path="/classUser" component={ClassUser} />
          <Route path="/class" component={ClassAdmin} />
          <Route path="/addclass" component={AddClass} />
          <Route path="/school" component={SchoolAdmin} />
          <Route path="/schoolNews" component={SchoolNews} />
          <Route path="/wrongTopic" component={WrongTopic} />
          <Route path="/user" component={UserList} />
          <Route path="/classReport" component={ClassReport} />
          <Route path="/stuReport" component={StuReport} />
          <Route path="/workReport" component={WorkReport} />
          <Route path="/userInfo" component={UserInfo} />
          <Route path="/schoolChart" component={SchoolChart} />
          <Route path="/classChart" component={ClassChart} />
          <Route path="/intelligentDollors" component={IntelligentDollors} />
          <Route path="/userImport" component={userImport} />
          <Route path="/specialDownload" component={specialDownload} />
        </Home>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
