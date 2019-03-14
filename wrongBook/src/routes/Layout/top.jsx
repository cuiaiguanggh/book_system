import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Popover} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Link} from "dva/router";
import store from 'store';
import style from './Menus.less';
// import head from '../images/t_nv_ig_n.png'
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
	render() {
		let userNews = store.get('wrongBookNews')
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
		console.log()
		return (
				<div className="navClass">
				{
					userNews ==undefined?'':
					<div>
						<Link to="/"  style={{cursor:'pointer'}} replace >
							{/* <img alt='' style={{height:'40px'}} src={head}/> */}
							<img alt='' style={{height:'40px'}} src={require('../images/t_nv_ig_n.png')}/>
						</Link>

						<span style={{marginLeft:50,fontSize:16}}>
						{leftName}
						</span>
						{
							this.props.type == 'findPsd' ?'' :
							<div className={style.usinfo}>
							
								<img  alt='' src={userNews.avatarUrl !==null ? userNews.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif' }/>
								
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
									</div>
								</Popover>
							</div>
						}
					</div>
				}
					
				</div>
		)
	}
	componentDidMount () {
		let userNews = store.get('wrongBookNews')
		if(userNews == undefined){
			this.props.dispatch(
				routerRedux.push({
					pathname: '/login',
					})
			)
		}
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomePageLeft);
