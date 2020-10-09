import { isQQApp } from '../../utils/index';

Page({
  data: {
    donationEnabled: !isQQApp
  }
})
