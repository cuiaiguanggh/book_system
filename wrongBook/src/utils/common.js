function noResposeDataCon(){
  return(
    <div style={{textAlign:'center',top:'25%',width:'100%',position:'relative',display:'flex',justifyContent:'center'}}>
        <img src={require('../routes/images/wsj-n.png')}></img>
        <span style={{fontSize:'20px',color:"#434e59",  height: 195,
        paddingTop: 50,
        lineHeight: '40px',
        textAlign: 'left',
        paddingLeft: 20,
        fontWeight: 700,}}>
          暂无数据
        </span>
    </div>
  )
}

export  {
	noResposeDataCon
} 