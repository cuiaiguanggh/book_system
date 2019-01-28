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
		  
		return (
				<div className="navClass">
					<Link to="/"  style={{cursor:'pointer'}} replace >
						<img alt='' style={{height:'40px'}} src={require("../images/t_nv_ig_n.png")}/>
					</Link>
					<span style={{marginLeft:50,fontSize:16}}>
					{
						userNews.rodeType > 10 ?
						userNews.schoolName:''
					}
					</span>
					<div className={style.usinfo}>
						<img  alt='' src={userNews.avatarUrl===null?'':userNews.avatarUrl }/>
						
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
				</div>
		)
	}
	componentDidMount () {
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomePageLeft);
