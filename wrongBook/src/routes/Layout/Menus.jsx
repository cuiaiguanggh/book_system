import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Popover} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Link} from "dva/router";
import store from 'store';
import style from './Menus.less';
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
	showConfirm = () => {
		// confirm({
		// 	title: '',
		// 	content: '确认退出',
		// 	onOk() {
        //         dispatch(
        //             routerRedux.push({
        //                 pathname: '/login',
        //               })
        //         )
		// 	},
		// 	onCancel() {
		// 		console.log('Cancel');
		// 	},
		// });
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
			else if(rodeType === 20)
				this.props.dispatch(
					routerRedux.push({
						pathname: '/schoolNews',
					})
				)
			else if(rodeType === 30)
			this.props.dispatch(
				routerRedux.push({
					pathname: '/grade',
					hash:`page=1`
				})
			)
			else if(rodeType === 40)
			this.props.dispatch(
				routerRedux.push({
					pathname: '/class',
					})
			)
		}
		
		if (memuList !== ''){
			memuList.map((item,i) =>{
				// 学校管理模块
				if(item === 100)
					if(rodeType === 10)
					menus.push(<Menu.Item key="school">
					<Link to='school#page=1' replace>
						<Icon type="bar-chart" />学校管理
					</Link>
					</Menu.Item>)
					else if(rodeType === 20)
					menus.push(<Menu.Item key="schoolNews"><Link to="/schoolNews" replace><Icon type="bar-chart" />学校详情</Link></Menu.Item>)
				// 班级管理模块
				if(item === 200)
					menus.push(<SubMenu key="sub" title={<span><Icon type="smile" />班级管理</span>}>
						{
							userNews.rodeType<= 30? 
							<Menu.Item key="grade">
								<Link to='grade#page=1' replace>
									<Icon type="bar-chart" />班级列表
								</Link>
						</Menu.Item>:
							<Menu.Item key="class"><Link to="/class" replace>班级详情</Link></Menu.Item>
						}
						<Menu.Item key="addclass"><Link to="/addclass" replace><Icon type="plus-circle" />添加班级</Link></Menu.Item>
					</SubMenu>)
				// 作业中心
				if(item === 300)
					menus.push(<Menu.Item key="home" style={{cursor:'pointer'}}>
						<Link to="/home"  style={{cursor:'pointer'}} replace >
						<Icon type="file-text" /><span style={{cursor:'pointer'}}>作业中心</span></Link>
				</Menu.Item>)
				// 用户管理
				if(item === 400)
					menus.push(<Menu.Item key="user"><Link to="/user" replace><Icon type="bar-chart" />用户管理</Link></Menu.Item>)
			})
			return(menus)
		}
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
				<div className="navClass">
					<img alt='' src={require("../images/t_nv_ig_n.png")} />
					<span></span>
					<div className={style.usinfo}>
						{this.userInfoCont()}
						<img  alt={userNews.userName} src={userNews.avatarUrl}/>
						<Popover
						 	content={content} 
							// trigger="click"
							 type="primary"
							 placement="bottom"
						>
							<div 
							className="btnBack" 
							 type="primary"
							onClick={this.showConfirm.bind(this)}>
								<span>{userNews.userName}</span>
							</div>
						</Popover>
					</div>
				</div>
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
							{this.Menus()}
						
						</Menu>
							<p className={style.phoneNum}>400-889-1291</p>
						</div>
						<div className='homePageContaier'>
							<div className={style.HomePageCent}>
								{this.props.children}
							</div>
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
