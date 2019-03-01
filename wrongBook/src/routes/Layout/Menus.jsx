import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Popover} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import QRCode from 'qrcode.react';
import {Link} from "dva/router";
import store from 'store';
import style from './Menus.less';
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
	//返回导航栏目
	Menus() {
		let memuList = this.props.state.MenuList;
		let menus = [];
		const rodeType = store.get('wrongBookNews').rodeType
		let pathname = this.props.location.pathname;
		let hash = this.props.location.hash;
		let key = hash.substr(hash.indexOf("page=")+5)*1;
		if(key === 0){
			key =1
		}
		if(pathname === '/'){
			if(rodeType === 10)
				this.props.dispatch(
					routerRedux.push({
						pathname: '/school',
						hash:`page=1`
					})
				)
			// else if(rodeType === 20)
			// 	this.props.dispatch(
			// 		routerRedux.push({
			// 			pathname: '/schoolNews',
			// 		})
			// 	)
			else if(rodeType === 30 || rodeType === 20){
				this.props.dispatch(
					routerRedux.push({
						pathname: '/workDetail',
					})
				)
			}
		}
		
		if (memuList !== ''){
			memuList.map((item,i) =>{
				// 学校管理模块
				if(item === 100){
					if(rodeType === 10){
						menus.push(<Menu.Item key="school">
							<Link to='school#page=1' replace>
								<Icon type="bar-chart" />学校管理
							</Link>
						</Menu.Item>)
					}else if(rodeType === 20){
					// menus.push(<Menu.Item key="schoolNews"><Link to="/schoolNews" replace><Icon type="bar-chart" />学校详情</Link></Menu.Item>)
					}
				}
				// 班级管理模块
				if(item === 200){
					if(rodeType <= 20){
						menus.push(
						// <SubMenu key="sub" title={<span><Icon type="smile" />班级管理</span>}>
								<Menu.Item key="grade">
									<Link to='grade#page=1' replace>
										<Icon type="bar-chart" />班级管理
									</Link>
							</Menu.Item>
						// </SubMenu>
						)
						menus.push(
							<Menu.Item key="addclass"><Link to="/addclass" replace><Icon type="plus-circle" />批量导入</Link></Menu.Item>
						)
					}else{
						menus.push(<Menu.Item key="grade">
							<Link to='grade#page=1' replace>
								<Icon type="bar-chart" />班级列表
							</Link>
						</Menu.Item>)
					}
				}
				// 作业中心
				if(item === 300){
					menus.push(<Menu.Item key="workDetail" style={{cursor:'pointer'}}>
						<Link to="/workDetail"  style={{cursor:'pointer'}} replace >
						<Icon type="file-text" /><span style={{cursor:'pointer'}}>错题报告</span></Link>
					</Menu.Item>)
				}
				// 用户管理
				// if(item === 400){
				// 	if(rodeType <= 20){
				// 		menus.push(<Menu.Item key="user"><Link to="/user" replace><Icon type="bar-chart" />用户管理</Link></Menu.Item>)
				// 	}
				// }
			})
			return(menus)
		}
	}
	render() {
		let  value= ''
		let userNews = store.get('wrongBookNews')
		let rodeType = ''
		if(!store.get('wrongBookNews')){
			this.props.dispatch(
				routerRedux.push({
					pathname: '/login'
				})
			)
		}else{
			value= `http://hw-test.mizholdings.com/static/sc?schoolId=${store.get('wrongBookNews').schoolId}&year=2018`
			rodeType = store.get('wrongBookNews').rodeType
		}
		let hash = this.props.location.pathname;
		if(!store.get('wrongBookNews')){
			this.props.dispatch(
				routerRedux.push({
					pathname: '/login'
				})
			)
		}
		let defaultKey = hash.substr(hash.indexOf("/")+1);
		if(defaultKey.indexOf('school') ===0){
			defaultKey = 'school'
		}else if(defaultKey.indexOf('grade') ===0){
			defaultKey = 'grade'
		}

		return (
			<div className={style.homePageContaier}>
				
				{
					!store.get('wrongBookNews')?
					'':<Top/>
				}
				<div className={style.HomePageCent}>

					<div className='pageLeftCont'>
						<div className='homePageLeft' >
						<Menu
							mode="inline"
							defaultSelectedKeys={[defaultKey]}
							style={{ width: 200 }}
							onClick={this.menuClick}
							// defaultSelectedKeys={['sub']}
							defaultOpenKeys={['sub']}
							// inlineCollapsed={col}
						>
							{
								!store.get('wrongBookNews')?
								'':this.Menus()
							}
						
						</Menu>
							{
								rodeType === 10 ?'':
								<div className={style.qrcode}>
									<QRCode className='qrcode' value={value} />
									<p>加入班级</p>
								</div>
							}
							<p className={style.phoneNum}>400-889-1291</p>
						</div>
						<div className={style.homepageRight}>
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentDidMount () {
		const {dispatch} = this.props;
		if(!store.get('wrongBookNews')){
			this.props.dispatch(
				routerRedux.push({
					pathname: '/login'
				})
			)
		}
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
