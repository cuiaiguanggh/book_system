import React from 'react';
import {
	Layout, message, Select, Icon, Button, Table
} from 'antd';
import { connect } from 'dva';
import style from './userImport.less';
import store from 'store';
import Dropzone from 'react-dropzone'
import { dataCenter } from '../../../config/dataCenter'
const { Option } = Select;
const { Content, Footer } = Layout;

class UserImport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileArr: [],
			file: [],
			schoolId: '',
			year: '',
			uploadFile: {},
			dianji: false,
			teaOrSte: 'tea'
		};

	}
	onImportExcel = file => {
		const { files } = file.target;
		if (files[0].name.indexOf('xls') < 0 && files[0].name.indexOf('xlsx') < 0 && files[0].name.indexOf('XLS') < 0 && files[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}

	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		if (acceptedFiles[0].path.indexOf('xls') < 0 && acceptedFiles[0].path.indexOf('xlsx') < 0 && acceptedFiles[0].name.indexOf('XLS') < 0 && acceptedFiles[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		this.setState({ file: acceptedFiles, uploadFile: acceptedFiles[0] });

	}

	render() {
		let columns = [
			{
				title: '班级名称',
				dataIndex: 'name',
				key: 'name',
				width: '16%',
				render: (text, record) => (
					text
				)
			}, {
				title: '年级',
				dataIndex: 'grade',
				key: 'grade',
				width: '16%',
				render: (text, record) => (
					text
				)
			}, {
				title: '教师姓名',
				dataIndex: 'teacher',
				key: 'teacher',
				width: '16%',
				render: (text, record) => (
					text
				)
			}, {
				title: '任教学科',
				dataIndex: 'sub',
				key: 'sub',
				width: '16%',
				render: (text, record) => (
					text
				)
			}, {
				title: '教师手机号',
				dataIndex: 'phone',
				key: 'phone',
				width: '16%',
				render: (text, record) => (
					text
				)
			}, {
				title: '状态',
				dataIndex: 'condition',
				key: 'condition',
				width: '16%',
				render: (text, record) => (
					text
				)
			},
		];
		let fileArr = this.state.fileArr;

		// const dataSource = [];
		// if (fileArr.length > 0) {
		// 	for (let i = 0; i < fileArr.length; i++) {
		// 		let det = fileArr[i]
		// 		let p = {};
		// 		try {
		// 			if (det.hasOwnProperty('年级')) {
		// 				p["grade"] = det.年级;
		// 				p["name"] = det.班级名称;
		// 			} else {
		// 				p["grade"] = dataSource[i - 1].grade;
		// 				p["name"] = dataSource[i - 1].name;
		// 			}

		// 		} catch (e) {
		// 			console.error('表格数据不对')
		// 		}
		// 		p["teacher"] = det.教师姓名;
		// 		p["sub"] = det.任教学科;
		// 		p["phone"] = det.教师手机号;
		// 		dataSource[i] = p;
		// 	}
		// }
		const dataSource = [{
			teacher: '11',
			sub: '22',
		}, {
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		}, {
			teacher: '11',
			sub: '22',
		}, {
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		}, {
			teacher: '11',
			sub: '22',
		}, {
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},
		{
			teacher: '11',
			sub: '22',
		},]

		return (
			<Layout style={{ background: '#fff' }}>
				<Content style={{ overflow: 'scroll' }}>
					<div className={style.gradeboder}>
						<div style={{ marginBottom: '10px' }}>
							<Select
								showSearch
								style={{ width: 200, marginRight: '10px' }}
								optionFilterProp="children"
								placeholder='请选择学年'
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								<Option value="jack">Jack</Option>
								<Option value="Yiminghe">yiminghe</Option>
							</Select>
							<Button type="primary" onClick={() => {
								window.open("http://homework.mizholdings.com/kacha/kcct/0747024f4a95a473/班级导入模板.XLSX", '_blank');
							}}>下载模板</Button>
							{
								dataSource != '' ?
									<Button
										type="primary"
										style={{ marginLeft: '10px' }}
										onClick={(e) => {
											//限制连续点击
											if (this.state.dianji) {
												setTimeout(() => {
													this.setState({
														dianji: false
													})
												}, 5000);
												return;
											}
											this.setState({
												dianji: true
											})
											let fileObj = this.state.uploadFile;
											let form = new FormData();
											form.append('excelFile', fileObj);
											let token = store.get('wrongBookToken');
											let schoolId = store.get('wrongBookNews').schoolId;
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
													}).then(response => response.json())
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
					</div>
					<div className={style.tableBox}>
						<p className={style.header}>
							<span style={{ fontWeight: 'bold' }}>
								学校：<span style={{ fontWeight: 400 }}> 杭州白马湖二中小学 </span>
							</span>

							<span style={{ margin: '0 100px', fontWeight: 'bold' }}>
								校管：<span style={{ fontWeight: 400 }}>王启年</span>
							</span>

							<span style={{ fontWeight: 'bold' }}>
								帐号：<span style={{ fontWeight: 400 }}>18762738771</span>
							</span>
						</p>
						<p className={style.twoHeader} onClick={(e) => {
							this.setState({
								teaOrSte: e.target.id
							})
						}}>
							<span id='tea' className={this.state.teaOrSte === 'tea' ? style.baise : ''} style={{ borderRight: '1px solid #dfe4ed' }}>教师</span>
							<span id='ste' className={this.state.teaOrSte === 'ste' ? style.baise : ''} style={this.state.teaOrSte === 'ste' ? { borderRight: '1px solid #dfe4ed' } : {}}>学生</span>
						</p>
						<Table
							style={{ padding: 15 }}
							bordered
							dataSource={dataSource}
							columns={columns}
							className={style.row}
							rowKey={(record, index) => index}
							pagination={{ pageSize: 10 }}
							scroll={{ y: 290 }}
						/>

					</div>



				</Content>

				<Footer style={{
					background: '#fff',
					textAlign: 'center',
					borderTop: '1px solid #E7E7E7'
				}}>
					<Button style={{
						margin: '0 10px',
						width: 99,
						height: 40,
						borderRadius: 3
					}}>取消导入  </Button>
					<Button type="primary" style={{
						margin: '0 10px',
						width: 99,
						height: 40,
						borderRadius: 3
					}}>确认导入</Button>
				</Footer>
			</Layout >
		)
	}
	componentDidMount() {

	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
	}
}))(UserImport);
