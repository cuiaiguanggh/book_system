import React from 'react';
import {
  Layout
} from 'antd';


const store = require('store');


//作业中心界面内容
const { Content,
} = Layout;

class workReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

 
  render() {
      const loginSession = store.get('wrongBookToken');
      let _hook = process.env.API_ENV === 't' ? 't' : 'p'
      const _url=`https://api.mizholdings.com/task/${_hook}/report.html?token=${loginSession}&examId=${this.props.location.examId||10}`
      console.log('_url: ', _url);
      return (
      <>
        <Content style={{ minHeight: 500, overflow: 'hidden', position: 'relative',padding:0 }}  >
          <iframe style={{width:'100%',height:'100%',border:0}} src={_url} ></iframe>
        </Content>
      </>
    )
  }

  componentDidMount() {
   
    

  }

  componentWillUnmount() {
    
  }



}

export default workReport
