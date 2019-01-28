import React,{ Component } from "react";
import 'antd/dist/antd.css';
import {Menu, Icon,Popover} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Link} from "dva/router";
import store from 'store';
import style from './workInfo.less';
import {dataCenter} from '../../config/dataCenter'
import Top from '../Layout/top'
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
        const {dispatch} = this.props;
		let location = this.props.location.hash;
		let hash = location.substr(location.indexOf("sId=")+4);
		let id = location.substr(location.indexOf("&id=")+4);
		let head = hash.split('&id=');
		let link = `workInfo#${head[0]}&id=`
        let ids = hash.substr(hash.indexOf("sId=")+4);
        let data = {
                classId:e.key,
        }
		dispatch(
			routerRedux.push({
				pathname: '/workInfo',
				hash:`sId=${head[0]}&id=${e.key}`
				})
		)
	}
	showConfirm = () => {
    }
	//返回导航栏目
	Menus() {
        let userNews = store.get('wrongBookNews')
        let workList = this.props.state.workList;
        let location = this.props.location.hash;
        let hash = location.substr(location.indexOf("sId=")+4);
        let id = location.substr(location.indexOf("&id=")+4);
        let head = hash.split('&id=');
        let link = `classInfo#${head[0]}&id=`
        if(workList.data){
            return(
                <div style={style.leftInfo}>
                    <h3 style={{padding:'5px',textAlign:'center'}}>
                        <Link to='/workDetail'>
                            <Icon type="left" style={{float:'left',fontSize:'20px',lineHeight:'30px',cursor:'pointer'}}/>
                        </Link>错题报告
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
                            workList.data.map((item,i)=>{
								const {dispatch} = this.props;
                                return (
                                    <Menu.Item key={item.homeworkId} >
											{item.name}
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
	children() {
		return(
			<div>
                123123
            </div>
		)
	}
	render() {
        let userNews = store.get('wrongBookNews')
		let hash = this.props.location.hash;
        let id = hash.substr(hash.indexOf("id=")+3);
        let token = store.get('wrongBookToken');

        let iframeSrc = dataCenter('/html/tempdata.html?homeworkId='+id+'&token='+token)
		return (
			<div className={style.homePageContaier}>
				<Top/>
				<div className={style.HomePageCent}>

					<div className='pageLeftCont'>
						<div className='homePageLeft' >
							{this.Menus()}
							<p className={style.phoneNum}>400-889-1291</p>
						</div>
						<div className='homePageContaier1'>
                            <iframe  className={style.iframe} src={iframeSrc}></iframe>
                            {/* <ClassAdmin></ClassAdmin> */}
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentDidMount () {
        const {dispatch} = this.props;
		let hash = this.props.location.hash;
        let ids = hash.substr(hash.indexOf("sId=")+4);
        console.log(ids)
        let id = ids.split('&id=');
        let data = {
            classId:id[0],
        }
        dispatch({
            type: 'classHome/queryHomeworkList',
            payload:data
        });

		
	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
		...state.homePage,
	}
}))(HomePageLeft);
