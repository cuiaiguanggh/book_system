import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Popover} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Link} from "dva/router";
import store from 'store';
import style from './userLeft.less';
import UserInfo from '../UserInfo/information'
import Top from './top'
const SubMenu = Menu.SubMenu;
const userNews = store.get('wrongBookNews')
//主界面内容
class HomePageLeft extends Component {
	constructor(props) {
		super(props);
		this.state={
			current:'home'
		}
	}
	menuClick = (e) =>{
		this.setState({
			current: e.key,
		  });
	}
    userInfoCont = () => {
		const rodeType = store.get('wrongBookNews').rodeType
		let Name=''
		if(rodeType === 10){
			Name = '总管理'
		}if(rodeType === 20){
			Name = '校管理'
		}if(rodeType === 30){
			Name = '班管理'
		}
        return (
            <div style={{display:"inline-block"}}>
                <div className="btnBack" >{Name}</div>
            </div>
        )
	}
	//返回导航栏目
	Menus() {
		let userNews = store.get('wrongBookNews')
		return(
			<div style={style.leftInfo}>
				<img alt='' src={userNews.avatarUrl}/>
				<h2>{userNews.userName}</h2>
				<Menu
					mode="inline"
					defaultSelectedKeys={['userinfo']}
					style={{ width: 200 }}
					onClick={this.menuClick}
					// defaultSelectedKeys={['sub']}
					defaultOpenKeys={['sub']}
					// inlineCollapsed={col}
				>
					<Menu.Item key="userinfo">
						<Link to='school#page=1' replace>
							<Icon type="bar-chart" />个人信息
						</Link>
					</Menu.Item>
				</Menu>
			</div>
		)
	}
	render() {
		let hash = this.props.location.pathname;
        let defaultKey = hash.substr(hash.indexOf("/")+1);
		const content = (
            <div className={style.userPover}>
              <p>个人信息</p>
              <p onClick={()=>{
				  	this.props.dispatch(
						routerRedux.push({
							pathname: '/login',
							})
					)
			  }}>退出</p>
            </div>
		  );
		let userNews = store.get('wrongBookNews')
		return (
			<div className={style.homePageContaier}>
				<Top/>
				<div className={style.HomePageCent}>

					<div className='pageLeftCont'>
						<div className='homePageLeft' >
							{this.Menus()}
							<p className={style.phoneNum}>400-889-1291</p>
						</div>
						<div className='homePageContaier'>
							<UserInfo />
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentDidMount () {
		const {dispatch} = this.props;
		dispatch({
			type: 'homePage/functionList'
		});
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomePageLeft);
