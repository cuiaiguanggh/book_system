import React, { Component } from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import { Layout, Menu, Icon, Tabs, Row, Col, Table, Input } from 'antd';
import style from './homeworkDetails.css';
import Top from '../../Homes/top';
import store from 'store';
import { dataCenter } from '../../../config/dataCenter';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
let token = store.get('wrongBookToken');


//学生成绩详情界面内容
class HomeworkDetails extends React.Component {
    constructor(props) {
        super(props)
        let id = ( '_' + Math.random()).replace('.','_');
        this.state = {
            tabId: '',
            lineId : 'line' + id,
            iFrameHeight: '0px',
            classScoreTableSearchVal: '',
            homeworkId: '',
            frameUrl: '',
            spin:false,

        }
        this._selectHomework = this.selectHomework.bind(this);

    }
    selectHomework = (e) => {
        let {dispatch} = this.props;
        dispatch({
            
			type: 'homePage/catalogId',
			payload: e.key
        }
        )

        this.setState({
            homeworkId: e.key,
            spin:true
        });
    }
    spin(){
        let spin = this.state.spin;
        let This = this
        if(spin){
            setTimeout(function(){
                This.setState({spin:false})
            },1000)
        return (
            <div className={style.divSpin}>
            <div className={style.spinInner}>
                <Icon type="loading" style={{color:'#fff',fontSize:'60px',}}></Icon>
            </div>
            </div>
        )
        }
    }
    render() {
		let dispatch = this.props.dispatch;
        let state = this.props.state;
		const classScoreTableSearchVal = this.state.classScoreTableSearchVal;
        let pageStuHInfo = state.pageHomeworkList;
        let analyzeRes = state.getWorkScopeWorkAnalyzeData;
        let listHomeworkRank = state.listHomeworkRankData;
        let getGroupIfo = state.getGroupMemberInfoData;
        
        let hash = this.props.location.hash;
        let classId = hash.substr(hash.indexOf("#")+1);
        let key = '';
        let ScoreDetMenu = [];
        let ScoreDetailsStuLeftCont;
        if(pageStuHInfo  != ''){
            for(let i=0;i<pageStuHInfo.length;i++){
                let det = pageStuHInfo[i];
                console.log(det.catalogId)
                ScoreDetMenu.push(<Menu.Item key={det.catalogId}>{det.name}</Menu.Item>);
            }
            key = this.props.state.catalogId;
            ScoreDetailsStuLeftCont = (
                <Menu
                    mode="inline"
                    className='homeworkList'
                    selectedKeys={[ this.props.state.catalogId]}
                    // defaultSelectedKeys={[ this.props.state.catalogId]}
                    style={{ width: 200 }}
                    onClick={this._selectHomework}
                >
                    {ScoreDetMenu}
                </Menu>
            )
        }
        let token = store.get('wrongBookToken');
        let iframeSrc = dataCenter('/jsp/tempdata.jsp?classId='+classId+'&catalogId='+this.props.state.catalogId+'&token='+token)
        return(
            <div  className="homePageContaier">
                <Top />
                <div className={style.HomePageCent}>
                    <div className='pageLeftCont'>
                        <div className='homeworkDetailsLeft'>
                            <div onClick={()=> dispatch(routerRedux.push({pathname: '/'}))} className={style.backScoreDetails}><span><Icon type="left" />&nbsp;&nbsp;作业中心</span></div>
                            {ScoreDetailsStuLeftCont}
                        </div>
                        <div className="scoredetailLayout">
                        {this.spin()}
                        <iframe className={style.iframe}  src={iframeSrc}/>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
    componentDidMount(){
        let hash = this.props.location.hash;
        let key = hash.substr(hash.indexOf("#")+1);
        let data ={
			classId:key
		}
		this.props.dispatch({
			type: 'homePage/queryClassBookChapterList',
			payload:data
		});
    }
}

export default connect((state) => ({
	state: {
        ...state.homePage,
	}
}))(HomeworkDetails);