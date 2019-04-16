const { User } = require('../../utils/av-live-query-weapp-min');

Page({
  data: {
    username: '',
    password: '',
    error: null,
    authData: '',
  },
  onLoad: function() {
    const user = User.current();
    if (user) {
      this.setData({
        username: user.get('username'),
        authData: JSON.stringify(user.get('authData'), undefined, 2),
      });
    }
  },
  updateUsername: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      username: value
    });
  },
  updatePassword: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      password: value
    });
  },
  save: function () {
    this.setData({
      error: null,
    });
    const { username, password } = this.data;
    const user = User.current();
    if (username) user.set({ username });
    if (password) user.set({ password });
    user.save().then(() => {
      wx.showToast({
        title: '更新成功',
        icon: 'success',
      });
    }).catch(error => {
      this.setData({
        error: error.message,
      });
    });
  }
});