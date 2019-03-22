import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Layout,Popover,Select} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import QRCode from 'qrcode.react';
import {Link} from "dva/router";
import store from 'store';
import style from './Menus.less';
import WrongTop from '../wrongReport/wrongTop/wrongTop'
import moment from 'moment';
const Option = Select.Option;
const {
	Header, Footer, Sider, Content,
  } = Layout;
const SubMenu = Menu.SubMenu;
const userNews = store.get('wrongBookNews')
const MenuItemGroup = Menu.ItemGroup;
//主界面内容
class HomePageLeft extends Component {
	constructor(props) {
		super(props);
		this.state={
			current:'home',
			collapsed: false,
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
						pathname: '/classReport',
					})
				)
			}
		}
		
		if (memuList !== ''){
			memuList.map((item,i) =>{
				// 学校管理模块
				if(item === 100 ){
					if(rodeType === 10){
						menus.push(<Menu.Item key="school">
							<Link to='school#page=1' replace>
								<Icon type="bar-chart" /><span>学校管理</span>
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
										<Icon type="bar-chart" /><span>班级管理</span>
									</Link>
							</Menu.Item>
						// </SubMenu>
						)
						menus.push(
							<Menu.Item key="addclass"><Link to="/addclass" replace><Icon type="plus-circle" /><span>批量导入</span></Link></Menu.Item>
						)
					}else{
						menus.push(<Menu.Item key="grade">
							<Link to='grade#page=1' replace>
								<Icon type="bar-chart" /><span>班级列表</span>
							</Link>
						</Menu.Item>)
					}
				}
				// 作业中心
				if(item === 300 && rodeType != 10){
					// menus.push(<Menu.Item key="workDetail" style={{cursor:'pointer'}}>
					// 	<Link to="/workDetail"  style={{cursor:'pointer'}} replace >
					// 	<Icon type="file-text" /><span style={{cursor:'pointer'}}>错题报告</span></Link>
					// </Menu.Item>)
					menus.push(<Menu.Item key="workDetail1" style={{cursor:'pointer'}}>
						<Link to="/classReport"  style={{cursor:'pointer'}} replace >
						<Icon type="file-text"  theme="filled"/><span style={{cursor:'pointer'}}>班级错题</span></Link>
					</Menu.Item>)
					menus.push(<Menu.Item key="workDetail2" style={{cursor:'pointer'}}>
						<Link to="/stuReport"  style={{cursor:'pointer'}} replace >
						<Icon type="appstore"  theme="filled"/><span style={{cursor:'pointer'}}>学生错题</span></Link>
					</Menu.Item>)
					menus.push(<Menu.Item key="workDetail3" style={{cursor:'pointer'}}>
						<Link to="/workReport"  style={{cursor:'pointer'}} replace >
						<Icon type="share-alt" /><span style={{cursor:'pointer'}}>作业报告</span></Link>
					</Menu.Item>)
				}
			})
			return(menus)
		}
	}
	toggle = () => {
		this.setState({
		  collapsed: !this.state.collapsed,
		});
		}
		
	getyear() {
		let yearList = this.props.state.yearList;
		const content = (
			<div>
				{
					yearList.data.map((item,i)=>(
						<p className={style.yearList} key={i} onClick={()=>{
							this.props.dispatch({
								type: 'temp/years',
								payload:item
							});
						}}>{item}</p>
					))
				}
			</div>
		);
		return(
			<div 
				className={style.usinfo1}
				type="primary">
					<span>{this.props.state.years} </span>
					{/* <Icon type="down" /> */}
				</div>
			// <Popover
			// 	content={content} 
			// 	trigger="click"
			// 	type="primary"
			// 	placement="bottom"
			// >
			// 	<div 
			// 	className={style.usinfo1}
			// 	type="primary">
			// 		<span>{this.props.state.years} </span>
			// 		<Icon type="down" />
			// 	</div>
			// </Popover>
		)
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
		}else if(defaultKey.indexOf('classReport') ===0){
			defaultKey = 'workDetail1'
		}else if(defaultKey.indexOf('stuReport') ===0){
			defaultKey = 'workDetail2'
		}else if(defaultKey.indexOf('workReport') ===0){
			defaultKey = 'workDetail3'
		}else if(defaultKey == ''){
			defaultKey = 'workDetail1'
		}
		const content = (
            <div className={style.userPover}>
                <p onClick={()=>{
				  	this.props.dispatch(
						routerRedux.push({
							pathname: '/userInfo',
                        })
					)
			  }}>个人信息</p>
              <p onClick={()=>{
				  store.set('wrongBookNews','')
				  	this.props.dispatch(
						routerRedux.push({
							pathname: '/login',
							})
					)
			  }}>退出</p>
            </div>
		  );
		let  leftName = ''
		if(this.props.type == 'findPsd'){
			leftName = '重置登录密码'
		}else{
			if(userNews.rodeType > 10){
				leftName = userNews.schoolName
			}
		}
		return (
			<Layout className={style.homePageContaier}>
				<Sider
				trigger={null}
				collapsible
				collapsed={this.state.collapsed}
				>
					<div className="logo" />
					<Menu 
						theme="dark" 
						mode="inline" 
						defaultSelectedKeys={[defaultKey]}
						onClick={(e)=>{
								this.setState({
									current: e.key,
								  });
							}}
					>
						{this.Menus()}
					</Menu>
					{
						rodeType === 10 ?'':
						<div className={style.qrcode}>
							<QRCode className='qrcode' value={value} />
							<p style={{color:'#fff',textAlign:"center"}}>加入班级</p>
						</div>
					}
				</Sider>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }}>
						<Icon
						style={{cursor:'pointer'}}
						className="trigger"
						type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
						onClick={this.toggle}
						/>
						<div className="navClass">
							{
								userNews ==undefined?'':
								<div>
									{
										this.props.state.yearList.data?
										this.getyear():''	
									}

									<span className={style.usinfo}>
									{leftName}
									</span>
									{
										this.props.type == 'findPsd' ?'' :
										<div className={style.usinfo}>

											{/* <img  alt='' src={userNews.avatarUrl !==null ? userNews.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif' }/> */}
											<img  alt='' src={userNews.avatarUrl!= null || userNews.avatarUrl != 'null'?'http://images.mizholdings.com/face/default/02.gif': userNews.avatarUrl  }/>
											
											<Popover
												content={content} 
												// trigger="click"
												type="primary"
												placement="bottom"
											>
												<div 
												className="btnBack" 
												type="primary">
													<span>{userNews.userName}</span>
													<Icon type="caret-down" style={{color:"#e1e1e1"}} />
												</div>
											</Popover>
										</div>
									}
								</div>
							}
								
							</div>
					</Header>
					{
						defaultKey.indexOf('workDetail') != -1 ?
						<Header style={{ background: '#a3b0c3',height:'50px', padding: 0 }}>
							<WrongTop type={this.props.location}/>
						</Header>:''
					}
				<Content style={{
					background: '#fff', 
					minHeight: 280,
					overflow:'auto',
					position:'relative'
				}}
				>
					{this.props.children}
				</Content>
				</Layout>
			</Layout>
		)
	}
	componentDidMount () {
		let logTime = store.get('logTime');
		if(!logTime && logTime == ''){
			let nowTime = new Date() - 10800000;
		}

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
		dispatch({
			type: 'report/getUserSubjectList'
		});
		dispatch({
			type: 'report/getUserSubjectList'
		});
		dispatch({
			type: 'homePage/getEnableYears',
			payload:{
				schoolId:store.get('wrongBookNews').schoolId
			}
		})
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
		...state.temp,
	}
}))(HomePageLeft);
