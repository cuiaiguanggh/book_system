import React from 'react';
import {
	Layout, message, Select, Icon, Button, Table
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './addClass.less';
import store from 'store';
import Dropzone from 'react-dropzone'
import * as XLSX from 'xlsx';
import { dataCenter } from '../../../config/dataCenter'
const Option = Select.Option;

const { Content } = Layout;

//作业中心界面内容
class HomeworkCenter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			editingKey: '',
			current: 'student',
			fileArr: [],
			file: [],
			schoolId: '',
			year: '',
			uploadFile: {}
		};
		this.dianjis = 0;
	}
	onImportExcel = file => {
		const { files } = file.target;

		if (files[0].name.indexOf('xls') < 0 && files[0].name.indexOf('xlsx') < 0 && files[0].name.indexOf('XLS') < 0 && files[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		const fileReader = new FileReader();
		this.setState({ file: files, uploadFile: file.target.files[0] })
		fileReader.onload = event => {
			try {
				this.setState({ file: fileReader })

				const { result } = event.target;
				// 以二进制流方式读取得到整份excel表格对象
				const workbook = XLSX.read(result, { type: 'binary' });
				let data = []; // 存储获取到的数据
				// 遍历每张工作表进行读取（这里默认只读取第一张表）
				for (const sheet in workbook.Sheets) {
					if (workbook.Sheets.hasOwnProperty(sheet)) {
						// 利用 sheet_to_json 方法将 excel 转成 json 数据
						data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
						break; // 如果只取第一张表，就取消注释这行
					}
				}
				this.setState({ fileArr: data })
			} catch (e) {
				// 这里可以抛出文件类型错误不正确的相关提示
				message.warning('文件类型不正确')
				return;
			}
		};
		// 以二进制方式打开文件
		fileReader.readAsBinaryString(files[0]);
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		if (acceptedFiles[0].path.indexOf('xls') < 0 && acceptedFiles[0].path.indexOf('xlsx') < 0 && acceptedFiles[0].name.indexOf('XLS') < 0 && acceptedFiles[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		this.setState({ file: acceptedFiles, uploadFile: acceptedFiles[0] });
		const fileReader = new FileReader();
		fileReader.onload = event => {
			try {
				this.setState({ file: fileReader });
				const { result } = event.target;
				const workbook = XLSX.read(result, { type: 'binary' });
				let data = [];
				for (const sheet in workbook.Sheets) {
					if (workbook.Sheets.hasOwnProperty(sheet)) {
						data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
					}
				}
				this.setState({ fileArr: data })
			} catch (e) {
				message.warning('文件类型不正确')
				return;
			}
		};
		fileReader.readAsBinaryString(acceptedFiles[0]);
	}
	// chooseSchool(){
	// 	const rodeType = store.get('wrongBookNews').rodeType;
	// 	if(rodeType === 10){
	// 	let schoolList = this.props.state.schoolList;
	// 		const children = [];
	// 		if(schoolList.data){
	// 			for (let i = 0; i < schoolList.data.list.length; i++) {
	// 				let data = schoolList.data.list[i]
	// 				children.push(<Option key={data.schoolId}>{data.schoolName}</Option>);
	// 			}
	// 			return(
	// 				<Select
	// 					showSearch
	// 					style={{ width: 200,marginRight:'10px' }}
	// 					placeholder='请选择学校'
	// 					optionFilterProp="children"
	// 					onChange={(value)=>{
	// 						this.props.dispatch({
	// 							type: 'classHome/schoolId',
	// 							payload:value
	// 						});
	// 						this.setState({schoolId:value})
	// 						this.props.dispatch({
	// 							type: 'classHome/getYears',
	// 							payload:{
	// 								schoolId:value
	// 							}
	// 						});
	// 					}}
	// 					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
	// 				>
	// 					{children}
	// 				</Select>
	// 			)
	// 		}
	//
	// 	}
	// }
	chooseYear() {
		const rodeType = store.get('wrongBookNews').rodeType;
		if (rodeType <= 20) {
			let yearList = this.props.state.yearList;
			const children = [];
			if (yearList.data) {
				for (let i = 0; i < yearList.data.length; i++) {
					let data = yearList.data[i];
					children.push(<Option key={data} value={data}>
						{`${data}-${Number(data) + 1}学年`}
					</Option>);
				}
				return (
					<Select
						showSearch
						style={{ width: 200, marginRight: '10px' }}
						optionFilterProp="children"
						placeholder='请选择学年'
						defaultValue={this.props.state.nowYear}
						onChange={(value) => {
							this.props.dispatch({
								type: 'classHome/nowYear',
								payload: value
							})
						}}
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						{children}
					</Select>
				)
			} else {
				return (
					<Select
						showSearch
						style={{ width: 200, marginRight: '10px' }}
						optionFilterProp="children"
						placeholder='请选择学年'
						onChange={(value) => {
							this.props.dispatch({
								type: 'classHome/nowYear',
								payload: value
							})
						}}
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						{children}
					</Select>
				)
			}
		}
	}
	render() {
		let state = this.props.state;
		let columns = [
			{
				title: '班级名称',
				dataIndex: 'name',
				key: 'name',
				width: '20%',
				render: (text, record) => (
					<div
						className='space'
						onClick={() => {
						}}>
						{text}
					</div>
				)
			},
			{
				title: '年级',
				dataIndex: 'grade',
				key: 'grade',
				width: '16%',
				render: (text, record) => (
					<div
						className='space'>
						{text}
					</div>
				)
			},
			{
				title: '教师姓名',
				dataIndex: 'teacher',
				key: 'teacher',
				width: '20%',
				render: (text, record) => (
					<div>
						{text}
					</div>
				)
			},
			{
				title: '班主任',
				dataIndex: 'teacherName',
				key: 'teacherName',
				width: '20%',
				render: (text, record) => (
					<div>
						{text}
					</div>
				)
			},
			{
				title: '学科',
				dataIndex: 'sub',
				key: 'sub',
				width: '20%',
				render: (text, record) => (
					<div>
						{text}
					</div>
				)
			},
			{
				title: '手机',
				dataIndex: 'phone',
				key: 'phone',
				width: '20%',
				render: (text, record) => (
					<div>
						{text}
					</div>
				)
			},
		];
		let fileArr = this.state.fileArr;

		const dataSource = [];
		if (fileArr.length > 0) {
			for (let i = 0; i < fileArr.length; i++) {
				let det = fileArr[i]
				let p = {};
				p["key"] = i;
				p["name"] = det.班级名称;
				p["teacher"] = det.姓名;
				p["teacherName"] = det.班主任;
				p["sub"] = det.学科;
				p["phone"] = det.手机号;
				p["grade"] = det.年级;
				dataSource[i] = p;
			}
		}
		const rodeType = store.get('wrongBookNews').rodeType
		return (
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder}>
						<div style={{ marginBottom: '10px' }}>
							{/*{this.chooseSchool()}*/}
							{this.chooseYear()}
							<Button onClick={() => {
								// window.open("http://homework.mizholdings.com/qiniu/31000/7511/D0539650-0039-4CAF-9CE5-7845AFD8ABED/教师信息采集模板.XLSX",'_blank');
								//下面暂时别发正式
								window.open("https://homework.mizholdings.com/qiniu/88908000/88888888/18E383AF-E059-4934-8B24-EB0B257FB15C/教师信息采集模板.XLSX", '_blank');
							}}>下载模板</Button>
							{
								dataSource != '' ?
									<Button
										type="primary"
										style={{ marginLeft: '10px' }}
										onClick={(e) => {
											//限制连续点击
											if (this.dianjis === 1) {
												setTimeout(()=>{ this.dianjis = 0}, 3000);
												return;
											}
											this.dianjis++;
											// let fileObj = document.getElementById('file').files[0];
											let fileObj = this.state.uploadFile;
											console.log(fileObj)
											let form = new FormData();
											form.append('excelFile', fileObj);

											let token = store.get('wrongBookToken');

											// let schoolId ='';
											// if(rodeType === 10){
											// 	schoolId=this.state.schoolId
											// }else{
											let schoolId = store.get('wrongBookNews').schoolId;
											// }
											if (store.get('wrongBookNews').rodeType === 1) {
												if (schoolId === '') {
													message.warning('请选择学校')
												}
											} else {
												if (this.props.state.nowYear === '') {
													message.warning('请选择学段')
												} else {
													form.append('schoolId', schoolId)
													form.append('year', this.props.state.nowYear)
													fetch(dataCenter('/school/class/manage/creat/excel'), {
														method: "POST",
														body: form,
														headers: {
															"Authorization": token
														}
													})
														.then(response => response.json())
														.then(res => {
															if (res.result === 0) {
																message.success('导入成功')
															} else {
																message.error(res.message)
															}
														})
														.catch(function (error) {
															message.error(error.message)
														})
												}
											}

										}}>确认添加</Button> : ''
							}
						</div>
						<Dropzone onDrop={this.onDrop}>
							{({ getRootProps, getInputProps, isDragActive }) => {
								return (
									<div className={style.addGrade}
										{...getRootProps()}
									>
										<span className={style.addSpan}>将Excel文件拖至此处或
											<label htmlFor="file">
												<span
													className={style.addButon}
												>上传</span>
											</label>
										</span>
									</div>
								)
							}}
						</Dropzone>
						<input
							type='file'
							id='file'
							accept='.xlsx, .xls'
							style={{ display: 'none' }}
							onChange={this.onImportExcel}
						/>

						<Table
							style={{ marginTop: '20px' }}
							bordered
							dataSource={dataSource}
							columns={columns}
							rowClassName="editable-row"
						/>

					</div>
				</Content>
			</Layout>
		)
	}
	componentDidMount() {
		// const rodeType = store.get('wrongBookNews').rodeType
		// if(rodeType === 10){
		// let data1 = {
		// 	pageNum:1,
		// 	pageSize:9999
		// }
		// this.props.dispatch({
		// 	type: 'classHome/pageRelevantSchool',
		// 	payload:data1
		// });
		// }else{
		this.props.dispatch({
			type: 'classHome/getYears',
			payload: {
				schoolId: store.get('wrongBookNews').schoolId
			}
		});
		// }
	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
	}
}))(HomeworkCenter);
