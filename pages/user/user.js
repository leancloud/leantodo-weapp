Page({
  data: {
    username: '',
    password: '',
    error: null,
    authData: '',
  },
  onLoad: function() {
    const user = LC.User.current();
    if (user) {
      this.setData({
        username: user.data.username,
        authData: JSON.stringify(user.data.authData, undefined, 2),
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
    const { username, password } = this.data;
    const data = {};
    if (username) {
      data.username = username;
    }
    if (password) {
      data.password = password;
    }
    const user = LC.User.current();
    try {
      await user.update(data);
      wx.showToast({
        title: '更新成功',
        icon: 'success',
      });
    } catch (error) {
      this.setData({ error: error.message });
    }
  }
});