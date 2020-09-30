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


function initQuestions (arr) {
  // console.log('list', arr)
  let time=[]
  let currentYear = new Date().getFullYear() + '年'
  arr.forEach(element => {
    if (element.uploadDate.indexOf(currentYear) === 0) {
      element.uploadDate = element.uploadDate.split(currentYear + '').join('')
    }
  })
  arr[0].showAddTime = true
  for (let i = 0; i < arr.length; i++) {
    // let _questions = []
    // arr[i].questionUrls ? _questions = arr[i].questionUrls : _questions = []
    // if (_questions.length > 0) {
    //   for (let j = 0; j < _questions.length; j++) {
    //     if (arr[i].questionUrls[j].indexOf('?imageMogr2') > -1) {
    //       arr[i].questionUrls[j] += '/?imageslim'
    //     } else {
    //       arr[i].questionUrls[j] += '?imageMogr2/?imageslim'
    //     }
    //   }
    // }
    if (i < arr.length - 1) {
      if (arr[i].uploadDate == arr[i + 1].uploadDate) {
        arr[i + 1].showAddTime = false
      } else {
        time.push(arr[i].uploadTime)
        arr[i + 1].showAddTime = true
      }
    }
  }
  // console.log('list1', arr)
  return {
    ques:arr,
    time
  }
}

export  {
	noResposeDataCon,initQuestions
} 