const { isQQApp } = require('../../utils/index');

Page({
  data: {
    donationEnabled: !isQQApp
  }
})