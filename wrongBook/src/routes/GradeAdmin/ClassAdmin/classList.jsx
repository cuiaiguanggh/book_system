import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Popover} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Link} from "dva/router";
import store from 'store';
import style from './classList.less';
import ClassAdmin from './classAdmin'
import Top from '../../Layout/top'
const SubMenu = Menu.SubMenu;
const userNews = store.get('wrongBookNews')
//主界面内容
class HomePageLeft extends Component {
	constructor(props) {
		super(props);
		this.state={
			current:'home',
			type:1
		}
	}
	menuClick = (e) =>{
        const {dispatch} = this.props;
		let location = this.props.location.hash;
		let hash = location.substr(location.indexOf("sId=")+4);
		let id = location.substr(location.indexOf("&id=")+4);
		let head = hash.split('&id=');
		let link = `classInfo#${head[0]}&id=`
		let userNews = store.get('wrongBookNews')
		if(e.key !== id){
			if(userNews.rodeType === 10){

				dispatch({
					type: 'homePage/infoClass',
					payload:e.key
				});
			}else{
				let id = hash.substr(hash.indexOf("&id=")+4);
				dispatch({
					type: 'homePage/infoClass',
					payload:e.key
				});
				
			}
			dispatch(
				routerRedux.push({
					pathname: '/classInfo',
					hash:`sId=${head[0]}&id=${e.key}`
				})
			)
			dispatch({
				type: 'homePage/teacherList',
				payload:this.props.state.memType
			});
			
		}
		
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
        let userNews = store.get('wrongBookNews')
		let location = this.props.location.hash;
		let classList = [];
        let hash = location.substr(location.indexOf("sId=")+4);
        let id = location.substr(location.indexOf("&id=")+4);
		let head = hash.split('&id=');
		let ha =store.get('wrong_hash')
		let link = `/grade#${ha.substr(ha.indexOf("#")+1)}`
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType <= 20){
			classList = this.props.state.classList;
		}else{
			classList = this.props.state.classList1;
		}
        if(classList.data){
            return(
                <div style={style.leftInfo}>
                    <h3 style={{padding:'5px',textAlign:'center'}}>
                        <Link to={link}>
                            <Icon type="left" style={{float:'left',fontSize:'20px',lineHeight:'30px',cursor:'pointer'}}/>
                        </Link>教师列表
                    </h3>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[id]}
                        style={{ width: 200 }}
                        onClick={this.menuClick}
                        // defaultSelectedKeys={['sub']}
                        defaultOpenKeys={['sub']}
                        // inlineCollapsed={col}
                    >
                        {
							rodeType <= 20 ?
                            classList.data.list.map((item,i)=>{
								const {dispatch} = this.props;
                                return (
                                    <Menu.Item key={item.classId} >
											{item.className}
                                    </Menu.Item>
								)
								}
							):
							classList.data.map((item,i)=>{
								const {dispatch} = this.props;
                                return (
                                    <Menu.Item key={item.classId} >
											{item.className}
                                    </Menu.Item>
                                )
								}
							)
                        }
                    </Menu>
                </div>
            )
        }
		
	}
	render() {
		let hash = this.props.location.pathname;
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
                            <ClassAdmin location={this.props.location}></ClassAdmin>
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentDidMount () {
        const {dispatch} = this.props;
		let hash = this.props.location.hash;
        let userNews = store.get('wrongBookNews')
        if(userNews.rodeType <= 20){
			let ids = hash.substr(hash.indexOf("sId=")+4);
            let id = ids.split('&id=');
            let data = {
                schoolId:id[0],
                pageSize:9999,
                pageNum:1
            }
            dispatch({
                type: 'classHome/pageClass',
                payload:data
			});
			
			dispatch({
				type: 'homePage/infoClass',
				payload:id[1]
			});
			dispatch({
				type: 'homePage/infoSchool',
				payload:id[0]
			});
        }else{
			let id = hash.substr(hash.indexOf("&id=")+4);
			dispatch({
				type: 'homePage/infoClass',
				payload:id
			});
			dispatch({
				type: 'homePage/infoSchool',
				payload:userNews.schoolId
			});
			let data = {
                schoolId:userNews.schoolId,
                pageSize:9999,
                pageNum:1
            }
            dispatch({
                type: 'classHome/getClassList',
			});
        }
		this.props.dispatch({
			type: 'homePage/teacherList',
			payload:{
				type:1
			}
		});
		this.props.dispatch({
			type: 'homePage/subjectNodeList',
		});
	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
		...state.homePage,
	}
}))(HomePageLeft);
