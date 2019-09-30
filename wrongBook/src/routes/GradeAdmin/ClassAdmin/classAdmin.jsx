import React from 'react';
import {
	Layout, Menu, Table, Input, message, Modal, Popconfirm, Select, Form, Popover, Button, Spin
} from 'antd';
// import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './classAdmin.less';
import store from 'store';
// import * as XLSX from 'xlsx';
const confirm = Modal.confirm;
const { Content } = Layout;
const Search = Input.Search;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Option = Select.Option;
const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);
function Trim() {
	String.prototype.trim = function () {
		return this.replace(/(^\s*) | (\s*$)/g, '');
	}
}

//作业中心界面内容
class HomeworkCenter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			editingKey: '',
			current: 'teacher',
			visible: false,
			teacher: '',
			phone: '',
			sub: 0,
			searchType: 0,
			teacherName: '',
			content: <div style={{ textAlign: "center",width: 300,height:280,display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column'  }}> <Spin /> </div>,
		};
		this.tea = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div>
					{text}
					{
						record.OnwerTeacher == 1 ?
							<span style={{ marginLeft: '5px', padding: '5px 10px', background: '#e7f4ff', 
							color: '#409eff', borderRadius: '3px', border: '1px solid #bde0ff' }}>
								班主任
						</span> : ""
					}
				</div>
			)
		},
		{
			title: <div className='space'>手机号</div>,
			dataIndex: 'phone',
			key: 'phone',
			align: 'center',
			editable: true,
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
			title: <div className='space'>学科</div>,
			dataIndex: 'subJec',
			key: 'subJec',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div className='space'>
					{text}
				</div>
			)
		},
		{
			title: <div className='space'>错题量</div>,
			dataIndex: 'wrongNum',
			key: 'wrongNum',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div className='space'>
					{text}
				</div>
			)
		},
		{
			title: <div className='space'>视频量</div>,
			dataIndex: 'teaVideoNum',
			key: 'teaVideoNum',
			align: 'center',
			editable: true,
			render: (text, record) => (
				<div
					className='space'>
					{text}
				</div>
			)
		},
		{
			title: <div className='space'>操作</div>,
			editable: true,
			align: 'center',
			render: (text, record) => {
				const rodeType = store.get('wrongBookNews').rodeType;
				if (rodeType <= 20) {
					return (
						<div>
							{record.OnwerTeacher == 1 && this.props.state.infoClass ?
									<Popover placement="leftBottom" title="邀请学生加入班级" trigger="focus" content={this.state.content}>
										<Button type="primary"
											onBlur={() => {
												this.setState({
													content: <div style={{ textAlign: "center",width: 300,height:280,
													display: 'flex',
													justifyContent: 'center',
													flexDirection: 'column' }}> <Spin /> </div>,
												})
											}}
											onClick={() => {
												this.props.dispatch({
													type: 'homePage/wxCode',
													payload: {
														classId: this.props.state.infoClass
													}
												}).then((res) => {
													if (res.hasOwnProperty('data')) {
														this.setState({
															content: <div style={{ textAlign: "center", borderRadius: '6%', overflow: 'hidden' ,width: 300,height:280}}>
																<img style={{ width: 300 }} src={res.data.url} />
															</div>,
														})
													}
												})
											}}>班级邀请码</Button>
									</Popover> : ''
							}
							{
								record.OnwerTeacher == 1 ?
									<span style={{ color: '#fff', display: "inline-block", width: '60px', cursor: 'pointer', margin: '0 10px', padding: '5px 0px', background: '#b6bac2', borderRadius: '5px', textAlign: 'center' }}
									>已任命</span> :
									<Popconfirm title={`是否任命${record.name}为班主任?`} okText="确认" cancelText="取消" onConfirm={() => {
										this.props.dispatch({
											type: 'classHome/updateClassAdmin',
											payload: {
												classId: this.props.state.infoClass,
												adminId: record.userId
											}
										});
									}}>
										<span style={{ color: '#fff', display: "inline-block", width: '60px', cursor: 'pointer', margin: '0 10px', padding: '5px 0px', background: '#1890ff', borderRadius: '5px', textAlign: 'center' }}
										>任命</span>
									</Popconfirm>
							}
							<span style={{ color: '#fff', display: "inline-block", width: '60px', cursor: 'pointer', margin: '0 10px', padding: '5px 0px', background: '#f56c6c', borderRadius: '5px', textAlign: 'center' }} onClick={() => {
								let This = this;
								confirm({
									title: `确定删除${record.name}么?`,
									okText: '是',
									cancelText: '否',
									onOk() {
										let data = {
											userId: record.userId
										}
										This.props.dispatch({
											type: 'homePage/kickClass',
											payload: data
										});
									},
									onCancel() {
										console.log('Cancel');
									},
								});
							}}>删除</span>
						</div>
					)
				}
			}
		}
		];
		this.stu = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			editable: true,
			render: (text, record, index) => (
				<input style={{ border: 0 }} defaultValue={text}
					onBlur={(e) => {
						if (text !== e.currentTarget.value) {
							this.props.dispatch({
								type: 'homePage/updateChild',
								payload: {
									childId: record.userId,
									name: e.currentTarget.value,
								}
							})
						}
					}} />
			)
		},
		{
			title: <div className='space'>错题量</div>,
			dataIndex: 'wrongNum',
			key: 'wrongNum',
			align: 'center',
			editable: false,
			render: (text, record) => (
				<div className='space'>
					{text}
				</div>
			)
		},
		{
			title: <div className='space'>联系电话</div>,
			dataIndex: 'parentPhones',
			key: 'parentPhones',
			align: 'center',
			editable: false,
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
			title: <div className='space'>视频数量</div>,
			dataIndex: 'courseVideoNum',
			key: 'courseVideoNum',
			align: 'center',
			editable: false,
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
			title: <div className='space'>操作</div>,
			editable: true,
			align: 'center',
			render: (text, record) => {
				const rodeType = store.get('wrongBookNews').rodeType
				if (rodeType <= 20) {
					return (
						<div>
							<span style={{ color: '#fff', display: "inline-block", width: '60px', cursor: 'pointer', margin: '0 10px', padding: '5px 0px', background: '#f56c6c', borderRadius: '5px', textAlign: 'center' }} onClick={() => {
								let This = this;
								confirm({
									title: `确定删除${record.name}么?`,
									okText: '是',
									cancelText: '否',
									onOk() {
										let data = {
											userId: record.userId
										}
										This.props.dispatch({
											type: 'homePage/kickClass',
											payload: data
										});
									},
									onCancel() {
										console.log('Cancel');
									},
								});
							}}>删除</span>
						</div>
					)
				}
			}
		}
		];

		// if (store.get('wrongBookNews').rodeType === 10) {
		// 	this.tea.push(
		// 		{
		// 			title: '编辑',
		// 			render: (text, record) => (
		// 				<div
		// 					style={{ color: '#1890ff', cursor: 'pointer' }}
		// 					onClick={() => {
		// 						let This = this;
		// 						confirm({
		// 							title: '确定要删除' + record.name + '教师么',
		// 							onOk() {
		// 								This.props.dispatch({
		// 									type: 'homePage/kickClass',
		// 									payload: {
		// 										userId: record.key,
		// 									}
		// 								});
		// 							},
		// 							onCancel() {
		// 								console.log('Cancel');
		// 							},
		// 						});
		// 					}}>
		// 					删除
		// 				</div>
		// 			)
		// 		}
		// 	)
		//
		// 	this.stu.push(
		// 		{
		// 			title: '编辑',
		// 			render: (text, record) => (
		// 				<div
		// 					style={{ color: '#1890ff', cursor: 'pointer' }}
		// 					onClick={() => {
		// 						let This = this;
		// 						confirm({
		// 							title: '确定要将' + record.name + '踢出班级么',
		// 							onOk() {
		// 								This.props.dispatch({
		// 									type: 'homePage/kickClass',
		// 									payload: {
		// 										userId: record.userId,
		// 									}
		// 								});
		// 							},
		// 							onCancel() {
		// 								console.log('Cancel');
		// 							},
		// 						});
		// 					}}>
		// 					踢出班级
		// 				</div>
		// 			)
		// 		}
		// 	)
		// }
	}

	isEditing = record => record.key === this.state.editingKey;

	cancel = () => {
		this.setState({ editingKey: '' });
	};

	save(form, key) {
		form.validateFields((error, row) => {
			console.log(row)
			message.warning('修改功能暂未开放');
			this.setState({ editingKey: '' });
		});
	}

	edit(key) {
		this.setState({ editingKey: key });
	}

	render() {
		let state = this.props.state;
		let rodeType = store.get('wrongBookNews').rodeType;
		let pageHomeworkDetiles = state.tealist;
		let dataSource = [];

		if (pageHomeworkDetiles.data) {
			for (let i = 0; i < pageHomeworkDetiles.data.length; i++) {
				let p = {};
				let det = pageHomeworkDetiles.data[i];
				if (state.showMen !== '') {
					if (det.userName && det.userName.indexOf(state.showMen) >= 0) {
						p["key"] = det.userId;
						p["userId"] = det.userId;
						p["head"] = det.avatarUrl ? det.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif'
						p["name"] = det.userName;
						p['subJec'] = det.subject;
						p['phone'] = det.phone;
						p['wrongNum'] = det.questionNum;
						p['OnwerTeacher'] = det.admin;
						p['parentPhones'] = det.parentPhones;
						p['courseVideoNum'] = det.courseVideoNum;
						p['teaVideoNum'] = det.teaVideoNum;
						dataSource.push(p);
					}
				} else {
					p["key"] =det.userId;
					p["userId"] = det.userId;
					p["head"] = det.avatarUrl ? det.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif'
					p["name"] = det.userName;
					p['wrongNum'] = det.questionNum;
					p['subJec'] = det.subject;
					p['phone'] = det.phone;
					p['OnwerTeacher'] = det.admin;
					p['parentPhones'] = det.parentPhones;
					p['courseVideoNum'] = det.courseVideoNum;
					p['teaVideoNum'] = det.teaVideoNum;
					dataSource.push(p);
				}
			}
		} else {
			dataSource = []
		}

		let columns = this.state.current === 'teacher' ? this.tea : this.stu;

		let sublist = this.props.state.sublist;
		const children = [];
		if (sublist.data) {
			for (let i = 0; i < sublist.data.length; i++) {
				let data = sublist.data[i]
				children.push(<Option key={data.k}>{data.v}</Option>);
			}
		}
		return (
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder} >
						<Menu
							className={style.menu}
							onClick={(e) => {
								this.setState({ current: e.key })
								this.props.dispatch({
									type: 'homePage/showMen',
									payload: ''
								});
								this.props.dispatch({
									type: 'homePage/tealist',
									payload: []
								});
								if (e.key === 'teacher') {
									this.props.dispatch({
										type: 'homePage/memType',
										payload: 1
									});
									this.props.dispatch({
										type: 'homePage/teacherList',
										payload: {
											type: 1
										}
									});

								} else {
									this.props.dispatch({
										type: 'homePage/memType',
										payload: 3
									});
									this.props.dispatch({
										type: 'homePage/teacherList',
										payload: {
											type: 3
										}
									});
								}

							}}
							selectedKeys={[this.state.current]}
							mode="horizontal"
						>
							<Menu.Item key="teacher" style={{ width: '120px', textAlign: 'center' }}>
								教师
							</Menu.Item>
							<Menu.Item key="student" style={{ width: '120px', textAlign: 'center' }} >
								学生
							</Menu.Item>
						</Menu>
						<div>
							<div style={{ overflow: 'hidden', textAlign: 'left ', padding: '10px' }}>
								<Search
									// value={this.props.state.showMen}
									placeholder="姓名"
									style={{ width: '300px', marginRight: '10px' }}
									enterButton="搜索"
									onSearch={value => {
										console.log(value)
										if (value.trim() != '') {
											this.props.dispatch({
												type: 'homePage/showMen',
												payload: value
											});
										} else {
											message.warning('请输入教师或学生名称')
										}
									}}
									onChange={e => {
										if (e.target.value.trim() == '') {
											this.props.dispatch({
												type: 'homePage/showMen',
												payload: ''
											});
										}
									}}
								/>
								{
									rodeType <= 20 && this.state.current === 'teacher' ?
										<span className={style.addGrade} onClick={() => {
											this.setState({ visible: true })
											// Modal.warning({
											// 	title: '添加教师功能暂未开放',
											// });
										}}>添加</span> : ''
								}
							</div>
							<div className={style.table}>
								<Table
									className={style.scoreDetTable}
									dataSource={dataSource}
									columns={columns}
									pagination={true}
									bordered={true}
									// components={components}
									rowClassName="editable-row"
								/>
							</div>
						</div>

					</div>
				</Content>
				<Modal
					title="添加教师"
					visible={this.state.visible}
					onOk={() => {
						Trim();
						let hash = this.props.location.hash;
						if (this.props.state.teacherName.trim() == '' ||
							this.props.state.phone.trim() == '' ||
							this.props.state.subjectId.trim() == '') {
							message.warning('请填写正确信息')
						} else {
							let data = {
								name: this.props.state.teacherName,
								phone: this.props.state.phone,
								classId: hash.substr(hash.indexOf("&id=") + 4),
								subjectId: this.props.state.subjectId
							}
							this.props.dispatch({
								type: 'homePage/createSchoolUser',
								payload: data
							});
							this.props.dispatch({
								type: 'homePage/teacherName',
								payload: ''
							});
							this.props.dispatch({
								type: 'homePage/phone',
								payload: ''
							});

							this.props.dispatch({
								type: 'homePage/subjectId',
								payload: ''
							});

							this.setState({
								visible: false,
							});
						}
					}}
					onCancel={() => {
						this.setState({
							visible: false,
						});
						this.props.dispatch({
							type: 'homePage/teacherName',
							payload: ''
						});
						this.props.dispatch({
							type: 'homePage/phone',
							payload: ''
						});

						this.props.dispatch({
							type: 'homePage/subjectId',
							payload: ''
						});
					}}
					okText='确定'
					cancelText='取消'
				>
					<div style={{ marginBottom: '10px' }}>
						<span style={{ width: "80px", display: 'inline-block' }}>姓名</span>
						<Input
							value={this.props.state.teacherName}
							onChange={(e) => {
								this.props.dispatch({
									type: 'homePage/teacherName',
									payload: e.target.value
								});
							}}
							onBlur={() => {
								const teachers = [];
								let teacherList = this.props.state.schoolTeacherList;
								if (teacherList.data) {
									for (let i = 0; i < teacherList.data.length; i++) {
										if (teacherList.data[i].userName == this.props.state.teacherName) {
											this.props.dispatch({
												type: 'homePage/phone',
												payload: teacherList.data[i].phone
											});
										}
									}
								}
							}}
							style={{ width: '200px' }} />

					</div>
					<div style={{ marginBottom: '10px' }}>
						<span style={{ width: "80px", display: 'inline-block' }}>电话</span>
						<Input
							value={this.props.state.phone}
							onChange={(e) => {
								this.props.dispatch({
									type: 'homePage/phone',
									payload: e.target.value
								});
							}} style={{ width: '200px' }} />
					</div>
					<div style={{ marginBottom: '10px' }}>
						<span style={{ width: "80px", display: 'inline-block' }}>学科</span>
						<Select
							showSearch
							style={{ width: 200 }}
							optionFilterProp="children"
							value={this.props.state.subjectId}
							onChange={(value) => {
								this.props.dispatch({
									type: 'homePage/subjectId',
									payload: value
								});
							}}
							// defaultValue={classInfo.data.classAdmin}
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
							{children}
						</Select>
					</div>
				</Modal>
			</Layout>
		);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'homePage/tealist',
			payload: []
		});
		// 清空models里搜索框内容
		this.props.dispatch({
			type: 'homePage/showMen',
			payload: ''
		});

	}
}

export default connect((state) => ({
	state: {
		...state.homePage
	}
}))(HomeworkCenter);
