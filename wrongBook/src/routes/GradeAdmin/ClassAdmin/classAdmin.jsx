import React from 'react';
import { Layout,Menu, Table, Input,message, Breadcrumb, InputNumber, Popconfirm, Form,
} from 'antd';
// import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './classAdmin.less';
import store from 'store';
// import * as XLSX from 'xlsx';

const { Content } = Layout;
const Search = Input.Search;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);


const EditableFormRow = Form.create()(EditableRow);

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


//作业中心界面内容
class HomeworkCenter extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			 editingKey: '',
			 current:'teacher'
			};
		this.tea = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			editable: true,
		},

		{
			title:'手机号',
			dataIndex:'phone',
			key:'phone',
			editable: true,
		},
		{
			title:'班主任',
			dataIndex:'OnwerTeacher',
			key:'OnwerTeacher',
			editable: true,
		},
	];
		
		this.stu = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			editable: true,
		},
		{
			title:'作业数量',
			dataIndex:'workNum',
			key:'workNum',
			editable: false,
		},
		{
			title:'学号',
			dataIndex:'stuNum',
			key:'stuNum',
			editable: true,
		},
		
		{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => {
				const editable = this.isEditing(record);
				return (
				<div>
					{editable ? (
					<span>
						<EditableContext.Consumer>
						{form => (
							<a
							onClick={() => this.save(form, record.key)}
							style={{ marginRight: 8 }}
							>
							保存
							</a>
						)}
						</EditableContext.Consumer>
						<Popconfirm
						title="确定要取消修改么?"
						okText='确认'
						cancelText='取消'
						onConfirm={() => this.cancel(record.key)}
						>
						<a>取消</a>
						</Popconfirm>
					</span>
					) : (
					<a onClick={() => this.edit(record.key)}>编辑</a>
					)}
				</div>
				);
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
		
		let pageHomeworkDetiles = state.tealist;
		const dataSource = [];
		console.log(pageHomeworkDetiles)
		if(pageHomeworkDetiles.data){
			for(let i = 0;i < pageHomeworkDetiles.data.length; i ++){
				let p = {};
				let det = pageHomeworkDetiles.data[i];
				p["key"] = det.userId;
				p["head"] = det.avatarUrl;
				p["name"] = det.userName;
				p['phone'] = det.phone
				dataSource[i]=p;
			}
		}
		
		const components = {
			body: {
			  row: EditableFormRow,
			  cell: EditableCell,
			},
		  };
		  let col = this.state.current === 'teacher' ?this.tea:this.stu
		  const columns = col.map((col) => {
			if (!col.editable) {
			  return col;
			}
			return {
			  ...col,
			  onCell: record => ({
				record,
				inputType: 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: this.isEditing(record),
			  }),
			};
		  });
		return(
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder} >
					{/* <Menu
						onClick={(e)=>{
							this.setState({current:e.key})
						}}
						selectedKeys={[this.state.current]}
						mode="horizontal"
					>
						<Menu.Item key="teacher">
						教师
						</Menu.Item>
						<Menu.Item key="student" >
						学生
						</Menu.Item>
					</Menu> */}
					<div style={{overflow:'hidden',marginBottom:"5px",textAlign:'right'}}>
							
							<Search
								placeholder="教师名称"
								style={{width:'300px'}}
								enterButton="搜索"
								onSearch={value => console.log(value)}
							/>
						</div>
					<Table 
						className={style.scoreDetTable}
						dataSource={dataSource}
						columns={columns}
						pagination={true}
						bordered={true}
						components={components}
						rowClassName="editable-row"
					/>
				</div>
				</Content>
			</Layout>
		);
	}
	componentDidMount(){
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomeworkCenter);