var express = require('express');
var router = express.Router();
const axios = require('axios')

/* GET home page. */
router.get('/WorkHoliday', function (req, res, next) {
  axios.get('https://touch.train.qunar.com/api/train/trainHotConf?conf_type=4&confKey=json.trainCalendarConfig').then((result) => {
    res.json(result.data)
  })
});

router.get('/getTickets', (req, res) => {
  const { startStation, endStation, date, onlyTickets, filterTicketType, filterTrainType, filterDepStation, filterArrStation, sort } = req.query;
  if (!startStation || !endStation || !date) {
    return res.json({
      status: 400,
      message: '参数错误'
    })
  }
  const filterStation = [...filterDepStation.split(','), ...filterArrStation.split(',')].filter((item) => item && item.trim()).join()
  axios.get('https://touch.train.qunar.com/api/train/trains2s', {
    params: {
      startStation,
      endStation,
      date,
      onlyTickets,
      sort,
      filterTicketType,
      filterTrainType,
      filterStation,
      searchType: 'stasta',
      bd_source: 'qunar',
      from: 'touchindex',
      e: 49,
      f: 3,
      wakeup: 1,
    }
  }).then((result) => {
    if (result.data.status !== 0) {
      return res.json({
        status: 401,
        message: '是不是去哪儿网的api改了导致的错误啊~~~'
      })
    }
    if (!result.data.dataMap.directTrainInfo) {
      return res.json({
        status: 0,
        message: '当前筛选条件无结果，已显示全部车次'
      })
    }
    res.json({
      status: 200,
      data: result.data.dataMap.directTrainInfo
    })
  })
})

router.get('/getCitySearch', (req, res) => {
  const { keyword } = req.query

  axios.get('https://touch.train.qunar.com/api/train/TrainStationSuggest', {
    params: {
      keyword: keyword ? keyword : 0,
      rtype: 4,
      _: Date.now()
    }
  }).then(value => {
    if (value.data.status === 0) {
      return res.json({
        status: 200,
        data: value.data.dataMap.result
      })
    } else {
      return res.json({
        status: 401,
        message: '是不是去哪儿网的api改了导致的错误啊~~~'
      })
    }
  })
})

router.get('/getCardData', (req, res) => {
  const { startCity, startStation, endCity, endStation, date, dptHm, trainNum } = req.query
  axios.get('https://touch.train.qunar.com/api/train/trainSeat', {
    params: {
      startCity, startStation, endCity, endStation, date, dptHm, trainNum,
      _: Date.now()
    }
  }).then(value => {
    return res.json(
      value.data
    )
  })
})

module.exports = router;
