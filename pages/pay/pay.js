import { Cloud as LCCloud } from '../../utils/lc.min';

const { db, lcApp } = getApp();
const User = db.class('_User');
const Order = db.class('Order');
const Cloud = new LCCloud(lcApp);

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
    const orders = await Order.where('user', '==', User.current())
      .where('status', '==', 'SUCCESS')
      .orderBy('createdAt', 'desc')
      .find();
    this.setData({ 
      orders: orders.map(order => Object.assign(order.toJSON(), {
        paidAt: order.data.paidAt.toLocaleString(),
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
    Cloud.run('order').then((data) => {
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
