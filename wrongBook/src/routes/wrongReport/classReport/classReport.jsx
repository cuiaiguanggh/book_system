import React from 'react';
import { Button, Tabs, Input,Modal,Select,Popover,Icon
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './classReport.less';
import store from 'store';
//作业中心界面内容
const Option = Select.Option;


class wrongTop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	    };
    }
   
	render() {
		return (
			<div style={{height:'50px',lineHeight:'50px'}}>
				<div>
					{
						this.props.state.mouths.map((item,i)=>(
							<span key={i} className='choseMonth'>{item}月</span>
						))
					}
				</div>
				<div className={style.outBody}>
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
				</div>
			</div>
		);
	  }

	componentDidMount(){
        console.log(this.props)
	}
}

export default connect((state) => ({
	state: {
		...state.report,
	}
}))(wrongTop);