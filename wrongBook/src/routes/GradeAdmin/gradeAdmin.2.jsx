import React from 'react';
import { Layout, Table, Input,  InputNumber, Form ,Modal,Select, Popconfirm,
	message, Pagination
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './gradeAdmin.less';
import store from 'store';

const confirm = Modal.confirm;
const Option = Select.Option;
const { Content } = Layout;
const Search = Input.Search;
//作业中心界面内容





const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
	this.state = {  editingKey: '' };
	this.columns = [
		{
			title: '班级名称',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
			editable: true,
			render: (text, record) => {
				return (
					<div className='space' style={{cursor:'pointer'}} onClick={()=>{
						store.set('wrong_hash', this.props.location.hash)
						this.props.dispatch(
							routerRedux.push({
								pathname: '/classInfo',
								hash:`sId=${this.props.state.schoolId}&id=${record.key}`
								})
						)
					}}>
						{text}
					</div>
				);
			}
		},
		{
			title:'班主任',
			dataIndex:'teacherName',
			key:'teacherName',
			width: '15%',
			editable: true,
			render: (text, record) => {
				return (
					<div style={{cursor:'pointer'}} onClick={()=>{
						store.set('wrong_hash', this.props.location.hash)
						this.props.dispatch(
							routerRedux.push({
								pathname: '/classInfo',
								hash:`sId=${this.props.state.schoolId}&id=${record.key}`
								})
						)
					}}>
						{text}
					</div>
				);
			}
		},
		{
			title:'人数',
			dataIndex:'stuNum',
			key:'stuNum',
			width: '15%',
			render: (text, record) => {
				return (
					<div style={{cursor:'pointer'}} onClick={()=>{
						store.set('wrong_hash', this.props.location.hash)
						this.props.dispatch(
							routerRedux.push({
								pathname: '/classInfo',
								hash:`sId=${this.props.state.schoolId}&id=${record.key}`
								})
						)
					}}>
						{text}
					</div>
				);
			}
		},
		{
			title:'作业数',
			dataIndex:'workNum',
			key:'workNum',
			width: '15%',
			render: (text, record) => {
				return (
					<div style={{cursor:'pointer'}} onClick={()=>{
						store.set('wrong_hash', this.props.location.hash)
						this.props.dispatch(
							routerRedux.push({
								pathname: '/classInfo',
								hash:`sId=${this.props.state.schoolId}&id=${record.key}`
								})
						)
					}}>
						{text}
					</div>
				);
			}
		},
		{
		title: '操作',
		dataIndex: 'operation',
		render: (text, record) => {
			console.log(record)
			const rodeType = store.get('wrongBookNews').rodeType
			const editable = this.isEditing(record);
			const { editingKey } = this.state;
			console.log(editingKey)
			if(rodeType <= 20) {
				const { editingKey } = this.state;
				const editable = this.isEditing(record);
				return (
					<div>
					{editable ? (
						<span>
						<EditableContext.Consumer>
							{form => (
							<a
								href="javascript:;"
								onClick={() => this.save(form, record.key)}
								style={{ marginRight: 8 }}
							>
								Save
							</a>
							)}
						</EditableContext.Consumer>
						<Popconfirm
							title="Sure to cancel?"
							onConfirm={() => this.cancel(record.key)}
						>
							<a>Cancel</a>
						</Popconfirm>
						</span>
					) : (
						<a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
					)}
					</div>
				);
				// return (
				// <div>
				// 	<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
				// 		this.setState({
				// 			visible:true,
				// 			classId:record.key
				// 		})
				// 		let data = {
				// 			classId:record.key
				// 		}
				// 		this.props.dispatch({
				// 			type: 'classHome/classInfo',
				// 			payload:data
				// 		});
						
				// 		this.props.dispatch({
				// 			type: 'classHome/classId',
				// 			payload:record.key
				// 		});
				// 		let data1 = {
				// 			schoolId:store.get('wrongBookNews').schoolId,
				// 			type:1
				// 		}
				// 		this.props.dispatch({
				// 			type: 'classHome/teacherList',
				// 			payload:data1
				// 		});
				// 	}}>编辑</span>
					
				// 	<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
				// 			let This = this;
				// 			confirm({
				// 				title: `确定删除${record.name}么?`,
				// 				okText: '是',
				// 				cancelText: '否',
				// 				onOk() {
				// 					let data = {
				// 						classId:record.key
				// 					}
				// 					This.props.dispatch({
				// 						type: 'classHome/deleteClass',
				// 						payload:data
				// 					});
				// 				},
				// 				onCancel() {
				// 					console.log('Cancel');
				// 				},
				// 		  });
				// 	}}>删除</span>
				// </div>
				// );
			}else{
				return ( <div></div>)
			}
		},
		},
	];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
	let state = this.props.state;
		let classList = state.classList;
		let classList1 = state.classList1;
		const dataSource = [];
		let total = 0;
		const rodeType = store.get('wrongBookNews').rodeType;
		let pages = 1;
		if(rodeType <=20){
				
			if(classList.data ){
				total = classList.data.total
				pages = classList.data.pages
				for(let i = 0;i < classList.data.list.length; i ++){
					let p = {};
					let det = classList.data.list[i];
					p["key"] = i;
					p["classId"] = det.classId;
					p['classCode'] = det.classCode;
					p["name"] = det.className;
					p["gradeId"] = det.gradeId;
					p["stars"] = det.stars;
					p["teacherName"] = det.classAdmin;
					p["stuNum"] = det.studentNum;
					p["workNum"] = det.wqNum;
					p["list"] = det;
					dataSource[i]=p;
				}
			}
		}else{
			if(classList1.data ){
				total = classList1.data.length
				// pages = classList.data.pages
				for(let i = 0;i < classList1.data.length; i ++){
					let p = {};
					let det = classList1.data[i];
					p["key"] = i;
					p["classId"] = det.classId;
					p['classCode'] = det.classCode;
					p["name"] = det.className;
					p["gradeId"] = det.gradeId;
					p["stars"] = det.stars;
					p["teacherName"] = det.classAdmin;
					p["stuNum"] = det.studentNum;
					p["workNum"] = det.workNum;
					p["list"] = det;
					dataSource[i]=p;
				}
			}
		}
		let classInfo = state.classNews;
		const hash = this.props.location.hash;
		let cur = hash.substr(hash.indexOf("page=")+5)*1;
		if(cur === 0){
			cur = 1
		}
		let teachers = state.teachers;
		const children = [];
		if(teachers.data){
			for (let i = 0; i < teachers.data.length; i++) {
				let data = teachers.data[i]
				children.push(<Option key={data.userId}>{data.userName}</Option>);
			}
		}


    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
	  
	  <Layout>
	  <Content style={{ overflow: 'initial' }}>
		  <div className={style.gradeboder} >
			  <div className={style.gradeTop}>
				  {/* {this.chooseSchool()} */}
				  <span>共{total}个班级</span>
				  {
					  rodeType <= 20 ?
					  <div className={style.addGrade} onClick={()=>{
						  if(this.state.schoolId === '' && rodeType === 10){
							  message.warning("请先选择学校")
						  }else{
							  this.setState({visible1:true})
							  let data1 = {
								  schoolId:this.props.state.schoolId,
								  type:1
							  }
							  this.props.dispatch({
								  type: 'classHome/teacherList',
								  payload:data1
							  });
						  }
						  
					  }}>添加</div>:''
				  }
					  
				  <Search
					  style={{float:'right',width:'300px',marginRight:'10px'}}
					  placeholder="班级名称"
					  enterButton="搜索"
					  onSearch={value => {
						  let data ={
							  pageNum:1,
							  pageSize:10,
							  className:value,
							  schoolId:this.props.state.schoolId
						  }
						  this.props.dispatch({
							  type: 'classHome/pageClass',
							  payload:data
						  });
						  this.props.dispatch(
							  routerRedux.push({
								  pathname: '/grade',
								  hash:'page=1'
							  })
						  )
					  }}
				  />
			  </div>
			  {/* <Table
				  bordered
				  dataSource={dataSource}
				  columns={this.columns}
				  rowClassName="editable-row"
			  />
			   */}
			  	<EditableContext.Provider value={this.props.form}>
					<Table
					components={components}
					bordered
					dataSource={dataSource}
					columns={columns}
					rowClassName="editable-row"
					pagination={{
						onChange: this.cancel,
					}}
					/>
				</EditableContext.Provider>
			  {
				   pages>1?
				   <Pagination defaultCurrent={cur} 
					   onChange={(pageNumber)=>{
						  this.props.dispatch(
							  routerRedux.push({
								  pathname: '/grade',
								  hash:`page=${pageNumber}`
								  })
						  )
						  let data ={
							  schoolId:this.props.state.schoolId,
							  pageNum:pageNumber,
							  pageSize:10
						  }
						  this.props.dispatch({
							  type: 'classHome/pageClass',
							  payload:data
						  });
					   }}
					   pageSize={10} defaultPageSize={10}  total={total} />:
				   ''
			  }
		  </div>
	  </Content>
	  <Modal
			  title="编辑"
			  visible={this.state.visible}
			  onOk={()=>{
				  this.setState({
					  visible: false,
				  });
				  this.props.dispatch({
					  type: 'classHome/updateClass',
				  });
			  }}
			  onCancel={()=>{
				  this.setState({
					  visible: false,
				  });
				  this.props.dispatch({
					  type: 'classHome/teachers',
					  payload:[]
				  });
			  }}
			  okText='确定'
			  cancelText='取消'
			  >
			  {
				  classInfo.data?
				  <div>
					  <div style={{marginBottom:'10px'}}>
						  <span style={{width:"80px",display:'inline-block'}} >班级</span>
						  <Input 
							  defaultValue={classInfo.data.className}
							  onChange={(e)=>{
								  this.props.dispatch({
									  type: 'classHome/className',
									  payload:e.target.value
								  });
							  }}
						   style={{width:'200px'}}/>
					  </div>
					  <div style={{marginBottom:'10px'}}>
						  <span style={{width:"80px",display:'inline-block'}}>班主任</span>
						  {
							  teachers.data?
							  <Select
								  showSearch
								  style={{ width: 200 }}
								  optionFilterProp="children"
								  onChange={(value)=>{
									  this.props.dispatch({
										  type: 'classHome/adminId',
										  payload:value
									  });
								  }}
								  defaultValue={classInfo.data.classAdmin}
								  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							  >
								  {children}
							  </Select>:''
						  }
						  
					  </div>
				  </div>
				  :
				  <div>
					  <div style={{marginBottom:'10px'}}>
						  <span style={{width:"80px",display:'inline-block'}} >班级</span>
						  <Input 
						   style={{width:'200px'}}/>
					  </div>
					  <div style={{marginBottom:'10px'}}>
						  <span style={{width:"80px",display:'inline-block'}}>班主任</span>
						  <Input  style={{width:'200px'}}/>
					  </div>
				  </div>
			  }
				  
		  </Modal>
		  <Modal
			  title="添加班级"
			  visible={this.state.visible1}
			  onOk={()=>{
				  if(this.props.state.className.replace(/(^\s*)|(\s*$)/g, "") == '' ) {
					  message.warning('班级名称不能为空')
				  }else if( this.props.state.adminId.replace(/(^\s*)|(\s*$)/g, "") == '' ){
					  message.warning('请选择班主任')
				  }else{
					  this.setState({
						  visible1: false,
					  });
					  this.props.dispatch({
						  type: 'classHome/addClass',
					  });
					  this.props.dispatch({
						  type: 'classHome/className',
						  payload:''
					  });
				  }
				  
				  
			  }}
			  onCancel={()=>{
				  this.setState({
					  visible1: false,
				  });
				  this.props.dispatch({
					  type: 'classHome/teachers',
					  payload:[]
				  });
			  }}
			  okText='确定'
			  cancelText='取消'
			  >
				  <div>
					  <div style={{marginBottom:'10px'}}>
						  <span style={{width:"80px",display:'inline-block'}} >班级</span>
						  <Input 
							  value={this.props.state.className}
							  onChange={(e)=>{
								  this.props.dispatch({
									  type: 'classHome/className',
									  payload:e.target.value
								  });
							  }}
						   style={{width:'200px'}}/>
					  </div>
					  <div style={{marginBottom:'10px'}}>
						  <span style={{width:"80px",display:'inline-block'}}>班主任</span>
							  <Select
								  showSearch
								  style={{ width: 200 }}
								  optionFilterProp="children"
								  onChange={(value)=>{
									  this.props.dispatch({
										  type: 'classHome/adminId',
										  payload:value
									  });
								  }}
								  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							  >
								  {children}
							  </Select>
						  
					  </div>
				  </div>
		  </Modal>
  </Layout>
    );
  }
	componentDidMount(){
		const hash = this.props.location.hash;
		let page = hash.substr(hash.indexOf("page=")+5)*1;
		if(page === 0){
			page = 1
		}
		const {dispatch} = this.props;
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType === 10){
			let data1 = {
				pageNum:1,
				pageSize:9999
			}
			dispatch({
				type: 'classHome/pageRelevantSchool',
				payload:data1
			});
		}else if(rodeType === 20 ){
			let data ={
				schoolId:store.get('wrongBookNews').schoolId,
				pageNum:page,
				pageSize:10
			}
			this.setState({schoolId:store.get('wrongBookNews').schoolId})
			this.props.dispatch({
				type: 'classHome/schoolId',
				payload:store.get('wrongBookNews').schoolId
			});
			dispatch({
				type: 'classHome/pageClass',
				payload:data
			});
		}else{
			this.props.dispatch({
				type: 'classHome/schoolId',
				payload:store.get('wrongBookNews').schoolId
			});
			this.setState({schoolId:store.get('wrongBookNews').schoolId})
			dispatch({
				type: 'classHome/getClassList',
			});
		}
	}
}
const HomeworkCenter = Form.create()(EditableTable);

export default connect((state) => ({
	state: {
		...state.classHome,
	}
}))(HomeworkCenter);