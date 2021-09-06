import AV from '../../lib/av-live-query-core';

Page({
  data: {
    username: '',
    password: '',
    error: null,
    authData: '',
  },
  onLoad: function() {
    const user = AV.User.current();
    if (user) {
      this.setData({
        username: user.getUsername(),
        authData: JSON.stringify(user.get('authData'), undefined, 2),
      });
    }
  },
  updateUsername: function ({ detail: { value } }) {
    this.setData({ username: value });
  },
  updatePassword: function ({ detail: { value } }) {
    this.setData({ password: value });
  },
  save: async function () {
    this.setData({ error: null });
    const user = AV.User.current();
    const { username, password } = this.data;
    if (username) {
      user.set('username', username);
    }
    if (password) {
      user.set('password', password);
    }
    try {
      await user.save();
      wx.showToast({
        title: '更新成功',
        icon: 'success',
      });
    } catch (error) {
      this.setData({ error: error.message });
    }
  }
});