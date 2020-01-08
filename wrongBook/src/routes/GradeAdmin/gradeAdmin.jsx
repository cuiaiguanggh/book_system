// import React from 'react';
// import {
// 	Layout, Table, Input, InputNumber, Form, Modal, Select, Popconfirm,
// 	message, Pagination
// } from 'antd';
// import { routerRedux, } from "dva/router";
// import { connect } from 'dva';
// // import {EditableCell,EditableFormRow} from '../../components/Example'
// // import style from './gradeAdmin.less';
// import store from 'store';

// const confirm = Modal.confirm;
// const Option = Select.Option;
// const { Content } = Layout;
// const Search = Input.Search;
// //作业中心界面内容

// function Trim() {
// 	String.prototype.trim = function () {
// 		return this.replace(/(^\s*) | (\s*$)/g, '');
// 	}
// }
// const FormItem = Form.Item;
// const EditableContext = React.createContext();

// class EditableCell extends React.Component {
// 	getInput = () => {
// 		if (this.props.inputType === 'number') {
// 			return <InputNumber />;
// 		}
// 		return <Input />;
// 	};

// 	render() {
// 		const {
// 			editing,
// 			dataIndex,
// 			title,
// 			inputType,
// 			record,
// 			index,
// 			...restProps
// 		} = this.props;
// 		return (
// 			<EditableContext.Consumer>
// 				{(form) => {
// 					const { getFieldDecorator } = form;
// 					return (
// 						<td {...restProps}>
// 							{editing ? (
// 								<FormItem style={{ margin: 0 }}>
// 									{getFieldDecorator(dataIndex, {
// 										rules: [{
// 											required: true,
// 											message: `请输入 ${title}!`,
// 										}],
// 										initialValue: record[dataIndex],
// 									})(this.getInput())}
// 								</FormItem>
// 							) : restProps.children}
// 						</td>
// 					);
// 				}}
// 			</EditableContext.Consumer>
// 		);
// 	}
// }

// class EditableTable extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = { editingKey: '', classId: '', searchClass: '' };
// 		this.columns = [
// 			{
// 				title: '班级名称',
// 				dataIndex: 'name',
// 				key: 'name',
// 				align: 'center',
// 				// width: '20%',
// 				editable: true,
// 				render: (text, record) => {
// 					return (
// 						<div style={{ cursor: 'pointer' }} onClick={() => {
// 							store.set('wrong_hash', this.props.location.hash)
// 							this.props.dispatch(
// 								routerRedux.push({
// 									pathname: '/classUser',
// 									hash: `sId=${this.props.state.schoolId}&id=${record.classId}`
// 								})
// 							)
// 						}}>
// 							{text}
// 						</div>
// 					);
// 				}
// 			},
// 			{
// 				title: '班主任',
// 				dataIndex: 'teacherName',
// 				key: 'teacherName',
// 				align: 'center',
// 				// width: '15%',
// 				render: (text, record) => {
// 					return (
// 						<div style={{ cursor: 'pointer' }} onClick={() => {
// 							store.set('wrong_hash', this.props.location.hash)
// 							this.props.dispatch(
// 								routerRedux.push({
// 									pathname: '/classUser',
// 									hash: `sId=${this.props.state.schoolId}&id=${record.classId}`
// 								})
// 							)
// 						}}>
// 							{text}
// 						</div>
// 					);
// 				}
// 			},
// 			{
// 				title: '人数',
// 				dataIndex: 'stuNum',
// 				key: 'stuNum',
// 				align: 'center',
// 				// width: '15%',
// 				render: (text, record) => {
// 					return (
// 						<div style={{ cursor: 'pointer' }} onClick={() => {
// 							store.set('wrong_hash', this.props.location.hash)
// 							this.props.dispatch(
// 								routerRedux.push({
// 									pathname: '/classUser',
// 									hash: `sId=${this.props.state.schoolId}&id=${record.classId}`
// 								})
// 							)
// 						}}>
// 							{text}
// 						</div>
// 					);
// 				}
// 			},
// 			{
// 				title: '操作',
// 				dataIndex: 'operation',
// 				align: 'center',
// 				width: '200px',
// 				render: (text, record) => {
// 					const rodeType = store.get('wrongBookNews').rodeType
// 					const editable = this.isEditing(record);
// 					if (rodeType <= 20) {
// 						const { editingKey } = this.state;
// 						const editable = this.isEditing(record);
// 						return (
// 							<div>
// 								{editable ? (
// 									<span>
// 										<EditableContext.Consumer>
// 											{form => (
// 												<span style={{ color: '#fff', cursor: 'pointer', margin: '0 10px', padding: '5px 15px', background: '#85ce61', borderRadius: '5px' }}
// 													onClick={() => this.save(form, record.key)}
// 												>保存</span>
// 											)}
// 										</EditableContext.Consumer>
// 										<span style={{ color: '#fff', cursor: 'pointer', margin: '0 10px', padding: '5px 15px', background: '#f56c6c', borderRadius: '5px' }} onClick={() => {
// 											this.cancel(record.key)
// 										}} >取消</span>
// 									</span>
// 								) : (
// 										<div>
// 											<span style={{ color: '#fff', cursor: 'pointer', margin: '0 10px', padding: '5px 15px', background: '#1890ff', borderRadius: '5px' }}
// 												onClick={() => {
// 													this.props.dispatch({
// 														type: 'classHome/classId',
// 														payload: record.classId
// 													});
// 													this.edit(record.key)
// 												}}	>编辑</span>

// 											<span style={{ color: '#fff', cursor: 'pointer', margin: '0 10px', padding: '5px 15px', background: '#f56c6c', borderRadius: '5px' }} onClick={() => {
// 												let This = this;
// 												confirm({
// 													title: `确定删除${record.name}么?`,
// 													okText: '是',
// 													cancelText: '否',
// 													onOk() {
// 														let data = {
// 															classId: record.classId
// 														}
// 														This.props.dispatch({
// 															type: 'classHome/deleteClass',
// 															payload: data
// 														});
// 														This.props.dispatch({
// 															type: 'classHome/classList',
// 															payload: []
// 														});
// 													},
// 													onCancel() {
// 														console.log('Cancel');
// 													},
// 												});
// 											}}>删除</span>
// 										</div>
// 										// <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
// 									)}
// 							</div>
// 						);
// 					} else {
// 						return (<div></div>)
// 					}
// 				},
// 			},
// 		];
// 	}

// 	isEditing = record => record.key === this.state.editingKey;

// 	cancel = () => {
// 		this.setState({ editingKey: '' });
// 	};

// 	save(form, key) {
// 		form.validateFields((error, row) => {
// 			if (error) {
// 				return;
// 			}
// 			Trim()
// 			if (row.name.trim() == '') {
// 				message.warning('班级名称不能为空')
// 			} else {
// 				this.props.dispatch({
// 					type: 'classHome/className',
// 					payload: row.name
// 				});
// 				this.props.dispatch({
// 					type: 'classHome/updateClass',
// 				});
// 				this.setState({ editingKey: '' });
// 			}
// 		});
// 	}

// 	edit(key) {
// 		this.setState({ editingKey: key });
// 	}


// 	render() {
// 		let state = this.props.state;
// 		let classList = state.classList;
// 		let classList1 = state.classList1;
// 		const dataSource = [];
// 		let total = 0;
// 		const rodeType = store.get('wrongBookNews').rodeType;
// 		let pages = 1;
// 		if (rodeType <= 20) {

// 			if (classList.data) {
// 				total = classList.data.total
// 				pages = classList.data.pages
// 				for (let i = 0; i < classList.data.list.length; i++) {
// 					let p = {};
// 					let det = classList.data.list[i];
// 					p["key"] = i;
// 					p["classId"] = det.classId;
// 					p['classCode'] = det.classCode;
// 					p["name"] = det.className;
// 					p["gradeId"] = det.gradeId;
// 					p["stars"] = det.stars;
// 					p["teacherName"] = det.classAdmin;
// 					p["list"] = det;
// 					dataSource[i] = p;
// 				}
// 			}
// 		} else {
// 			if (classList1.data) {
// 				total = classList1.data.length
// 				// pages = classList.data.pages
// 				for (let i = 0; i < classList1.data.length; i++) {
// 					let p = {};
// 					let det = classList1.data[i];
// 					p["key"] = i;
// 					p["classId"] = det.classId;
// 					p['classCode'] = det.classCode;
// 					p["name"] = det.className;
// 					p["gradeId"] = det.gradeId;
// 					p["stars"] = det.stars;
// 					p["teacherName"] = det.classAdmin;
// 					p["list"] = det;
// 					dataSource[i] = p;
// 				}
// 			}
// 		}
// 		let classInfo = state.classNews;
// 		const hash = this.props.location.hash;
// 		let cur = hash.substr(hash.indexOf("page=") + 5) * 1;
// 		if (cur === 0) {
// 			cur = 1
// 		}
// 		let teachers = state.teachers;
// 		const children = [];
// 		if (teachers.data) {
// 			for (let i = 0; i < teachers.data.length; i++) {
// 				let data = teachers.data[i]
// 				children.push(<Option key={data.userId}>{data.userName}</Option>);
// 			}
// 		}


// 		const components = {
// 			body: {
// 				cell: EditableCell,
// 			},
// 		};

// 		const columns = this.columns.map((col) => {
// 			if (!col.editable) {
// 				return col;
// 			}
// 			return {
// 				...col,
// 				onCell: record => ({
// 					record,
// 					inputType: col.dataIndex === 'age' ? 'number' : 'text',
// 					dataIndex: col.dataIndex,
// 					title: col.title,
// 					editing: this.isEditing(record),
// 				}),
// 			};
// 		});

// 		return (

// 			<Layout>
// 				<Content style={{ overflow: 'initial', background: '#fff' }}>
// 					<div className={style.gradeboder} >
// 						<div className={style.gradeTop}>
// 							<span style={{ marginRight: '10px', fontWeight: 'bold' }}>搜索班级</span>
// 							<Search
// 								style={{ width: '300px', marginRight: '10px' }}
// 								placeholder="班级名称"
// 								enterButton="搜索"
// 								onChange={e => {
// 									this.setState({
// 										searchClass: e.currentTarget.value
// 									})
// 								}}
// 								onSearch={value => {
// 									const rodeType = store.get('wrongBookNews').rodeType;
// 									if (rodeType !== 10 && rodeType !== 20) {
// 										this.props.dispatch({
// 											type: 'classHome/searchClass',
// 											payload: {
// 												className: this.state.searchClass
// 											}
// 										});
// 									}
// 									this.props.dispatch({
// 										type: 'classHome/pageClass',
// 										payload: {
// 											pageNum: 1,
// 											pageSize: 10,
// 											className: value,
// 											schoolId: this.props.state.schoolId
// 										}
// 									});
// 								}}
// 							/>
// 							{
// 								rodeType <= 20 ?
// 									<div className={style.addGrade} onClick={() => {
// 										if (this.state.schoolId === '' && rodeType === 10) {
// 											message.warning("请先选择学校")
// 										} else {
// 											this.setState({ visible1: true })
// 											this.props.dispatch({
// 												type: 'classHome/teacherList',
// 												payload: {
// 													schoolId: this.props.state.schoolId,
// 													type: 1
// 												}
// 											});
// 										}

// 									}}>添加</div> : ''
// 							}
// 						</div>
// 						{/* <Table
// 						bordered
// 						dataSource={dataSource}
// 						columns={this.columns}
// 						rowClassName="editable-row"
// 					/>
// 					*/}
// 						<EditableContext.Provider value={this.props.form}>
// 							<Table
// 								components={components}
// 								bordered
// 								dataSource={dataSource}
// 								columns={columns}
// 								rowClassName="editable-row"
// 								pagination={{
// 									onChange: this.cancel,
// 								}}
// 							/>
// 						</EditableContext.Provider>
// 						{
// 							pages > 1 ?
// 								<Pagination defaultCurrent={cur}
// 									style={{ marginTop: '10px', textAlign: 'center' }}
// 									onChange={(pageNumber) => {
// 										this.cancel()
// 										this.props.dispatch(
// 											routerRedux.push({
// 												pathname: '/grade',
// 												hash: `page=${pageNumber}`
// 											})
// 										)
// 										let data = {
// 											schoolId: this.props.state.schoolId,
// 											pageNum: pageNumber,
// 											pageSize: 10
// 										}
// 										this.props.dispatch({
// 											type: 'classHome/pageClass',
// 											payload: data
// 										});
// 									}}
// 									pageSize={10} defaultPageSize={10} total={total} /> :
// 								''
// 						}
// 					</div>
// 				</Content>
// 				<Modal
// 					title="编辑"
// 					visible={this.state.visible}
// 					onOk={() => {
// 						this.setState({
// 							visible: false,
// 						});
// 						this.props.dispatch({
// 							type: 'classHome/updateClass',
// 						});
// 					}}
// 					onCancel={() => {
// 						this.setState({
// 							visible: false,
// 						});
// 						this.props.dispatch({
// 							type: 'classHome/teachers',
// 							payload: []
// 						});
// 					}}
// 					okText='确定'
// 					cancelText='取消'
// 				>
// 					{
// 						classInfo.data ?
// 							<div>
// 								<div style={{ marginBottom: '10px' }}>
// 									<span style={{ width: "80px", display: 'inline-block' }} >班级</span>
// 									<Input
// 										defaultValue={classInfo.data.className}
// 										onChange={(e) => {
// 											this.props.dispatch({
// 												type: 'classHome/className',
// 												payload: e.target.value
// 											});
// 										}}
// 										style={{ width: '200px' }} />
// 								</div>
// 								<div style={{ marginBottom: '10px' }}>
// 									<span style={{ width: "80px", display: 'inline-block' }}>班主任</span>
// 									{
// 										teachers.data ?
// 											<Select
// 												showSearch
// 												style={{ width: 200 }}
// 												optionFilterProp="children"
// 												onChange={(value) => {
// 													this.props.dispatch({
// 														type: 'classHome/adminId',
// 														payload: value
// 													});
// 												}}
// 												defaultValue={classInfo.data.classAdmin}
// 												filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
// 											>
// 												{children}
// 											</Select> : ''
// 									}

// 								</div>
// 							</div>
// 							:
// 							<div>
// 								<div style={{ marginBottom: '10px' }}>
// 									<span style={{ width: "80px", display: 'inline-block' }} >班级</span>
// 									<Input
// 										style={{ width: '200px' }} />
// 								</div>
// 								<div style={{ marginBottom: '10px' }}>
// 									<span style={{ width: "80px", display: 'inline-block' }}>班主任</span>
// 									<Input style={{ width: '200px' }} />
// 								</div>
// 							</div>
// 					}

// 				</Modal>
// 				<Modal
// 					title="添加班级"
// 					visible={this.state.visible1}
// 					onOk={() => {
// 						if (this.props.state.className.replace(/(^\s*)|(\s*$)/g, "") == '') {
// 							message.warning('班级名称不能为空')
// 						} else if (this.props.state.adminId.replace(/(^\s*)|(\s*$)/g, "") == '') {
// 							message.warning('请选择班主任')
// 						} else {
// 							this.setState({
// 								visible1: false,
// 							});
// 							this.props.dispatch({
// 								type: 'classHome/addClass',
// 							});
// 							this.props.dispatch({
// 								type: 'classHome/className',
// 								payload: ''
// 							});
// 						}
// 					}}
// 					onCancel={() => {
// 						this.setState({
// 							visible1: false,
// 						});
// 						this.props.dispatch({
// 							type: 'classHome/teachers',
// 							payload: []
// 						});
// 					}}
// 					okText='确定'
// 					cancelText='取消'>
// 					<div>
// 						<div style={{ marginBottom: '10px' }}>
// 							<span style={{ width: "80px", display: 'inline-block' }} >班级</span>
// 							<Input
// 								value={this.props.state.className}
// 								onChange={(e) => {
// 									this.props.dispatch({
// 										type: 'classHome/className',
// 										payload: e.target.value
// 									});
// 								}}
// 								style={{ width: '200px' }} />
// 						</div>
// 						<div style={{ marginBottom: '10px' }}>
// 							<span style={{ width: "80px", display: 'inline-block' }}>班主任</span>
// 							<Select
// 								showSearch
// 								style={{ width: 200 }}
// 								optionFilterProp="children"
// 								onChange={(value) => {
// 									this.props.dispatch({
// 										type: 'classHome/adminId',
// 										payload: value
// 									});
// 								}}
// 								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
// 							>
// 								{children}
// 							</Select>

// 						</div>
// 					</div>
// 				</Modal>
// 			</Layout>
// 		);
// 	}
// 	componentDidMount() {
// 		const hash = this.props.location.hash;
// 		let page = hash.substr(hash.indexOf("page=") + 5) * 1;
// 		if (page === 0) {
// 			page = 1
// 		}
// 		const { dispatch } = this.props;
// 		const rodeType = store.get('wrongBookNews').rodeType
// 		console.log(rodeType, this.state)
// 		if (rodeType === 10) {
// 			let data1 = {
// 				pageNum: 1,
// 				pageSize: 9999
// 			}
// 			dispatch({
// 				type: 'classHome/pageRelevantSchool',
// 				payload: data1
// 			});
// 		} else if (rodeType === 20) {
// 			let data = {
// 				schoolId: store.get('wrongBookNews').schoolId,
// 				pageNum: page,
// 				pageSize: 10
// 			}
// 			this.setState({ schoolId: store.get('wrongBookNews').schoolId })
// 			this.props.dispatch({
// 				type: 'classHome/schoolId',
// 				payload: store.get('wrongBookNews').schoolId
// 			});
// 			dispatch({
// 				type: 'classHome/pageClass',
// 				payload: data
// 			});
// 		} else {
// 			this.props.dispatch({
// 				type: 'classHome/schoolId',
// 				payload: store.get('wrongBookNews').schoolId
// 			});
// 			this.setState({ schoolId: store.get('wrongBookNews').schoolId })
// 			dispatch({
// 				type: 'classHome/getClassList',
// 				payload: {
// 					year: this.props.state.years,
// 					schoolId: store.get('wrongBookNews').schoolId
// 				}
// 			});
// 		}

// 	}
// }
// const HomeworkCenter = Form.create()(EditableTable);

// export default connect((state) => ({
// 	state: {
// 		...state.classHome,
// 	}
// }))(HomeworkCenter);
