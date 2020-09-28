import React, { useState, useEffect } from 'react';
import style from './Section.less';
import { connect } from 'dva';
import { Input, Button, Checkbox, message ,Popover,Popconfirm} from 'antd';
const { TextArea } = Input;

function Section(props) {
		const [delting, setDeleting] = useState(false);
		const [showParse, setShowParse] = useState(true);
    useEffect(() => {
        
    });

		function deleteQuestion(que){

			setDeleting(true)
			props.dispatch({
				type:'workManage/doQuesDelete',
				payload:{
					qusId:que.qusId,
					partId:que.partId
				}
			}).then((res)=>{
				setDeleting(false)
				if(res.data.result===0){	
					message.destroy()
					message.success('题目删除成功')			
				}
			})
		}

		return (
			<>
			<div   className={style.queitem} 
				>
				<div  className={style.que_box}>
						<div className={style.title}>
							{` 第${props.index+1}题`}
							<span style={{marginLeft:20}}>知识点：</span>
							<div className={style._edit_box}>
								<Button type='primary' loading={delting} onClick={()=>deleteQuestion(props.question)}>删除</Button>
								{/* {
									props.question.question?<></>:
									<>
									<Button type='primary'>重新匹配</Button>
									</>
								} */}
								
							</div>
						</div>
						<div className={style._content}>
							<div>
								<img style={{marginBottom:14}} src={props.question.areaList&&props.question.areaList.length>0?props.question.areaList[0].areaUrl:''} alt=""/>
							</div>
							{props.showQuestion&&props.question?<>
							<div>
								<div className={style.qtitle} dangerouslySetInnerHTML={{ __html: props.question.qusContent }}>
								</div>
							</div>

								<div style={{height:50,display:'flex',alignItems:'center',justifyContent:'flex-start'}}>
									<Button 
										onClick={()=>{
										let bool=showParse
										setShowParse(!bool)
										console.log('showParse: ', showParse);
									}}>{showParse?'展开解析':'收起解析'}</Button>

								</div>
								<div className={[showParse?'hide qparse':'qparse'].join(' ')} >
									【解析】
									<div  dangerouslySetInnerHTML={{ __html: props.question.analysis }}>
									</div>
								</div >

							</>:""}
						</div>
					</div>
								
			</div>
			</>
    )

}
export default connect((state) => ({
	state: {
		

	}
}))(Section);