import React, { useState, useEffect } from 'react';
import style from './Section.less';
import { Input, Button, Checkbox, message ,Popover} from 'antd';
const { TextArea } = Input;

export default function Section(props) {
    const [load, setLoad] = useState(0);
    const [newsrc, setNewsrc] = useState(props.src);
		const [editSectionName, setEditSectionName] = useState(false);
		const [editNameIndex, setEditNameIndex] = useState(-1);
		const [editPartName, setEditPartName] = useState(false);
		const [editPartIndex, setEditPartIndex] = useState(-1);
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

		function addPart(index,section){
			console.log('section: ', section);
			const {area,question}=section
			props.section.sections[index].areas.push({question,area})
			console.log('props.section.sections: ', props.section.sections);
			props.addPartHander(props.index,props.section.sections)
		}

		function deleteSectionQuestion(index){
			props.section.areas.splice(index,1)
			props.upSectionHander()
		}
		function deleteParkQuestion(index,i){
			props.section.sections[index].areas.splice(i,1)
			props.upSectionHander()
		}

		
		return (
			<div>
				<div key={props.index} style={{marginTop:14}} className={style.queitem}>
					<div className={style.quelabel} style={{marginTop:10}}>
						{editNameIndex===props.index&&editSectionName?
							<Input autoFocus={editNameIndex===props.index&&editSectionName} style={{width:100}} onBlur={()=>{
								setEditNameIndex(-1)
								setEditSectionName(false)
								props.upSectionHander()
							}} 
							onChange={(e)=>{
								props.section.name=e.target.value
							}}
							defaultValue={props.section.name?props.section.name:`第${props.index+1}部分`}></Input>
							:
							<>
								{props.section.name?props.section.name:`第${props.index+1}部分`}
								<img style={{marginLeft:8}} src={require('../../images/edit.png')} alt=""
									onClick={(e)=>{
										console.log('e: ', e);
										setEditNameIndex(props.index)
										setEditSectionName(true)
										console.log(editNameIndex,editSectionName)
										e.stopPropagation()
									}}
								/>
							</>
						}
						<img style={{marginLeft:20}} onClick={(e)=>{
							updatePart(e,props.section)
						}} src={require('../../images/up.png')} alt=""/>
						<img style={{marginLeft:8}} onClick={(e)=>{
							deleteSection(e,props.index)
						}}  src={require('../../images/down.png')} alt=""/>
					</div> 
								<div className={style._section}>
									{
										props.section.sections.length?props.section.sections.map((section, k) => {
											return (
												<div className={style.part_box} key={section.name}>
													<div style={{display:'flex',alignItems:'center'}}>
														{
															editPartName&&editPartIndex==`${props.index}${k}`?
															<Input autoFocus={editPartName&&editPartIndex==`${props.index}${k}`} style={{width:100}} 
															onBlur={(e)=>{
																setEditPartIndex(-1)
																setEditPartName(false)
																props.upSectionHander()
															}} 
															onChange={(e)=>{
																console.log('e: ', e);
																props.section.sections[k].name=e.target.value
															}}
															defaultValue={section.name}></Input>:
															<>
																{section.name}
																<img 
																	onClick={()=>{
																		setEditPartIndex(`${props.index}${k}`)
																		setEditPartName(true)
																	}} 
																	style={{marginLeft:8}} 
																	src={require('../../images/edit.png')} alt=""
																/>
															</>
														}
														
														<img style={{marginLeft:20}} 
															onClick={(e)=>{
																updatePart(e,props.section)}} src={require('../../images/up.png')} alt=""
														/>
														<img  style={{marginLeft:8}}  src={require('../../images/down.png')} alt=""
															onClick={(e)=>{
																updatePart(e,props.section,k)}}
														/>
													</div>
													{
														section.areas?section.areas.map((area, j1) => {
															return (
																			<div key={j1} className={style.que_box}>
																				<div className={style.title}>
																					<Checkbox >
																						{` 第${j1+1}题`}
																					</Checkbox>
																					<div className={style._edit_box}>
																							<Button type='primary' onClick={()=>deleteParkQuestion(k,j1)}>删除</Button>
																							<Popover placement="left"  trigger="click" content={
																								props.section.sections.map((_section,k)=>{
																									return (
																											<Button disabled={_section.id==section.id} className={style.partp} key={k} onClick={()=>{
																												addPart(k,area)
																											}}>{_section.name}</Button>
																										)
																									})
																								}>
																							<Button type='primary'>移动到单元中</Button>
																						</Popover>
																							{
																								area.question?<>
																								{/* <Popover placement="left" title='123' content='123'>
																									<Button type='primary'>移动到单元中</Button>
																								</Popover> */}
																								</>:
																								<>
																									<Button type='primary'>重新匹配</Button>
																									{/* <Button type='primary'>录入</Button> */}
																								</>
																							}
																						
																					</div>
																				</div>
																				<div className={style._content}>
																					{area.question?<>
																						<div className={style.qtitle} dangerouslySetInnerHTML={{ __html: area.question.title }}>
																						</div>
																						<div>解析</div>
																						<div className={style.qparse} dangerouslySetInnerHTML={{ __html: area.question.parse }}>
																						</div>
													
																					</>:<img  src={area.area.imgUrl} alt=""/>}
																				</div>
																			</div>
																			)
															}):''
													}
												</div>
											)
										}):''
									}
								</div>
								{props.section.areas?props.section.areas.map((area, j) => {
									return (
													<div key={j} className={style.que_box}>
														<div className={style.title}>
															<Checkbox >
																{` 第${j+1}题`}
															</Checkbox>
															<div className={style._edit_box}>
																<Button type='primary' onClick={()=>deleteSectionQuestion(j)}>删除</Button>
																<Popover placement="left"  trigger="click" content={
																		props.section.sections.map((_section,k)=>{
																			return (
																					<Button  className={style.partp} key={k} onClick={()=>{
																						addPart(k,area)
																					}}>{_section.name}</Button>
																				)
																			})
																		}>
																	<Button type='primary'>移动到单元中</Button>
																</Popover>
																{
																	area.question?<></>:
																	<>
																	<Button type='primary'>重新匹配</Button>
																	{/* <Button type='primary'>录入</Button> */}
																	</>
																}
																
															</div>
														</div>
														<div className={style._content}>
															{area.question?<>
																<div className={style.qtitle} dangerouslySetInnerHTML={{ __html: area.question.title }}>
																</div>
																<div>解析</div>
																<div className={style.qparse} dangerouslySetInnerHTML={{ __html: area.question.parse }}>
																</div>
							
															</>:<img  src={area.area.imgUrl} alt=""/>}
														</div>
													</div>
													)
									}):''
								}
							</div>
							
						
					
				</div>
    )

}
