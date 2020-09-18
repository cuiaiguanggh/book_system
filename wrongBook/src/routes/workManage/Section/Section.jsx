import React, { useState, useEffect } from 'react';
import style from './Section.less';
import { Input, Button, Checkbox, message ,Popover,Popconfirm} from 'antd';
const { TextArea } = Input;

export default function Section(props) {
    const [load, setLoad] = useState(0);
    const [newsrc, setNewsrc] = useState(props.src);
		const [editSectionName, setEditSectionName] = useState(false);
		const [editNameIndex, setEditNameIndex] = useState(-1);
		const [editPartName, setEditPartName] = useState(false);
		const [editPartIndex, setEditPartIndex] = useState(-1);
		const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    useEffect(() => {
        if (newsrc !== props.src) {
            setNewsrc(props.src)
            setLoad(0)
        }
    });

		function deleteSection(e,index){
			props.deleteSectionHander(index)
			e.stopPropagation()
		}
		function updatePart(e,item,index){
			if(index==undefined){
				item.sections.push({
					name:`第${item.sections.length+1}章节`,
					id:item.sections.length,
					areas:[]
				})
			}else{
				item.sections.splice(index,1)
			}
			props.upSectionHander()
			e.stopPropagation()
		}

		function removePart(index,section,i,ispart){
			// const {question}=section
			// props.question.sections[index].areas.splice(i,1)
			// // if(ispart){
			// // 	props.question.sections[index].areas.splice(i,1)
			// // }else{
			// // 	props.question.areas.splice(index,1)
			// // }
			// props.question.sections[index].areas.push({question,question})
			// props.addPartHander(props.index,props.question.sections)
		}

		function deleteSectionQuestion(index){
			props.question.areas.splice(index,1)
			props.upSectionHander()
		}
		function deleteParkQuestion(index,i){
			props.question.sections[index].areas.splice(i,1)
			props.upSectionHander()
		}

		return (
			<>
			<div key={props.indexkey} style={{marginTop:14}} className={style.queitem}>
				<div  className={style.que_box}>
						<div className={style.title}>
							<Checkbox 
									defaultChecked={props.ischecked}
									onChange={(e)=>{
										let _v=e.target.checked
										let _myQid=`${props.question.pageid}${props.question.num}`
										// let arr=selectedQuestionIds
										// if(e.target.checked){
										// 	arr.push(_myQid)
										// }else{
										// 	arr.splice(arr.findIndex(item => item === _myQid), 1)
										// }
										// setSelectedQuestionIds(arr)
										// console.log('e: ', _myQid,arr)
										props.questionChangeSelect(_v,_myQid,props.question)
									}}
								>
								{` 第${props.index+1}题`}
							</Checkbox>
							<div className={style._edit_box}>
								<Button type='primary' onClick={()=>deleteSectionQuestion(props.index)}>删除</Button>
								{
									props.question.question?<></>:
									<>
									<Button type='primary'>重新匹配</Button>
									</>
								}
								
							</div>
						</div>
						<div className={style._content}>
							{!props.showPicture&&props.question.question?<>
								<div className={style.qtitle} dangerouslySetInnerHTML={{ __html: props.question.question.title }}>
								</div>
								<div>解析</div>
								<div className={style.qparse} dangerouslySetInnerHTML={{ __html: props.question.question.parse }}>
								</div>

							</>:<img  src={props.question.area?props.question.area.imgUrl:''} alt=""/>}
						</div>
					</div>
								
			</div>
			</>
    )

}
