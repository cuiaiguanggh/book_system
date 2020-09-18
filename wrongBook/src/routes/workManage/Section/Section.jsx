import React, { useState, useEffect } from 'react';
import style from './Section.less';
import { Input, Button, Checkbox, message ,Popover,Popconfirm} from 'antd';
const { TextArea } = Input;

export default function Section(props) {
    const [load, setLoad] = useState(0);
		const [newsrc, setNewsrc] = useState(props.src);
		const [showParse, setShowParse] = useState(true);
    useEffect(() => {
        if (newsrc !== props.src) {
            setNewsrc(props.src)
            setLoad(0)
        }
    });

		



		function deleteSectionQuestion(index){
			props.question.areas.splice(index,1)
			props.upSectionHander()
		}



		return (
			<>
			<div   className={style.queitem} 
				>
				<div  className={style.que_box}>
						<div className={style.title}>
							{/* <Checkbox 
									defaultChecked={props.ischecked}
									onChange={(e)=>{
										let _v=e.target.checked
										let _myQid=`${props.question.pageid}${props.question.num}`
										props.questionChangeSelect(_v,_myQid,props.question)
									}}
								>
								{` 第${props.index+1}题`}
							</Checkbox> */}
							{` 第${props.index+1}题`}
							<span style={{marginLeft:20}}>知识点：</span>
							<div className={style._edit_box}>
								{/* <Button type='primary' onClick={()=>deleteSectionQuestion(props.index)}>删除</Button> */}
								{
									props.question.question?<></>:
									<>
									<Button type='primary'>重新匹配</Button>
									</>
								}
								
							</div>
						</div>
						<div className={style._content}>
							<div>
								<img style={{marginBottom:14}} src={props.question.area?props.question.area.imgUrl:''} alt=""/>
							</div>
							{props.showQuestion&&props.question.question?<>
							<div>
								<div className={style.qtitle} dangerouslySetInnerHTML={{ __html: props.question.question.title }}>
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
									<div  dangerouslySetInnerHTML={{ __html: props.question.question.parse }}>
									</div>
								</div >

							</>:""}
						</div>
					</div>
								
			</div>
			</>
    )

}
