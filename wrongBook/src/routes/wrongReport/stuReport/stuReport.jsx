import React from 'react';
import { Layout, Menu, Button,Modal,Select,Popover,Icon
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './stuReport.less';
import store from 'store';
//作业中心界面内容
const Option = Select.Option;
const {
	Header, Footer, Sider, Content,
  } = Layout;

class StuReport extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			current:'home'
		}
	}
	render() {
		return (
				<div className={style.layout}>
					<div style={{height:'50px',lineHeight:'50px',background:'#fff'}}>
						{
							this.props.state.mouths.map((item,i)=>(
								<span key={i} className='choseMonth'>{item}月</span>
							))
						}
					</div>
					<Layout className={style.innerOut}>
						<Sider  className={style.sider}>
							<Menu 
							// theme="dark" 
							mode="inline" 
							defaultSelectedKeys={['1']}
							onClick={(e)=>{
									this.setState({
										current: e.key,
										});
								}}
						>
							<Menu.Item key="1" style={{cursor:'pointer'}}>
								<div style={{overflow:'hidden'}}>
									<span style={{float:'left'}}>啦啦啦</span>
									<span style={{float:'right'}}>8道</span>
								</div>
							</Menu.Item>
						</Menu>
						</Sider>
						<Content className={style.content}>
							<div className={style.questionBody}>
								<div className={style.questionTop}>
									<span>第一题</span>
									<span>班级错误率：80%（答错15人）</span>
								</div>
								<img></img>
								<div style={{overflow:'hidden',padding:'10px'}}>
									<Button style={{float:'left'}}>查看统计</Button>
									<Button type="primary" style={{float:'right'}}>加入错题篮</Button>
								</div>
							</div>
						</Content>
					</Layout>
				</div>
		)
	}

	componentDidMount(){
        console.log(this.props)
	}
}

export default connect((state) => ({
	state: {
		...state.report,
	}
}))(StuReport);