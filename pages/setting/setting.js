const AV = require('../../utils/leancloud-storage');
const Todo = require('../../todo');

Page({
    data: {
        user: AV.User.current(),
        username: '',
        password: '',
        error: null,
    },
    updateUsername:  function ({
        detail: {
            value
        }
    }) {
        this.setData({
            username: value
        });
    },
    updatePassword:  function ({
        detail: {
            value
        }
    }) {
        this.setData({
            password: value
        });
    },
    save: function() {
        this.setData({
            error: null,
        });
        const { username, password } = this.data;
        const user = AV.User.current();
        if (username) user.set({username});
        if (password) user.set({password});
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