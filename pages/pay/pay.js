import AV from '../../lib/av-live-query-core';

Page({
  data: {
    orders: [],
    error: null,
  },
  onLoad() {
    return this.refreshOrders();
  },
  onPullDownRefresh() {
    return this.refreshOrders().finally(wx.stopPullDownRefresh);
  },
  async refreshOrders() {
    const orders = await new AV.Query('Order')
      .equalTo('user', AV.User.current())
      .equalTo('status', 'SUCCESS')
      .descending('createdAt')
      .find();
    this.setData({
      orders: orders.map(order => Object.assign(order.toJSON(), {
        paidAt: order.get('paidAt').toLocaleString(),
      }))
    })
  },
  donate() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    });
    AV.Cloud.run('order').then((data) => {
      wx.hideToast();
      data.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        setTimeout(this.refreshOrders.bind(this), 1500);
      };
      data.fail = ({errMsg}) => this.setData({ error: errMsg });
      wx.requestPayment(data);
    }).catch(error => {
      this.setData({ error: error.message });
      wx.hideToast();
    });
  }
});
