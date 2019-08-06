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
class Top extends Component {
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
		return (
				<div className="navClass">
					<div  style={{height:'89px',background:'#fff',borderBottom:"1px solid #e3e9f3",lineHeight:"90px"}}>
						<div style ={{width:"1200px",margin:'0 auto'}}>
							<Link to="/login"  style={{cursor:'pointer'}} replace >
								{/* <img alt='' style={{height:'40px'}} src={head}/> */}
								<img alt='' style={{height:'40px'}} src={require('../images/t_nv_ig_n.png')}/>
							</Link>
							<span style={{marginLeft:50,fontSize:16}}>
							{leftName}
							</span>
							{
								this.props.type == 'findPsd' ?'' :
								<div style={{float:'right',display:"inline-block"}} >
									<img style={{height:'40px'}} alt='' src={userNews.avatarUrl!= null || userNews.avatarUrl != 'null'?'http://images.mizholdings.com/face/default/02.gif': userNews.avatarUrl  }/>
									<Popover
										content={content} 
										// trigger="click"
										type="primary"
										placement="bottom"
									>
										<div 
										style={{float:'right',margin:'0 10px'}}
										type="primary">
											<span>{userNews.userName}</span>
										</div>
									</Popover>
								</div>
							}
						</div>
					</div>
					
				</div>
		)
	}
	componentDidMount () {
		let userNews = store.get('wrongBookNews')
		
		if(userNews == undefined){
			if(this.props.type !== 'findPsd'){
				this.props.dispatch(
					routerRedux.push({
						pathname: '/login',
						})
				)
			}
		}
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(Top);
