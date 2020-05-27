const AV = require('../../utils/av-live-query-core-min');
const Todo = require('../../model/todo');
const { jsonify, isQQApp } = require('../../utils/index');
const bind = require('../../utils/live-query-binding');
const { getAuthInfo: getWxAuthInfo } = require('../../utils/platform-adapters-weapp');
const { getAuthInfo: getQQAuthInfo } = require('../../utils/platform-adapters-qqapp');

const loginFn = async options => {
  let authInfo;
  if (isQQApp) {
    authInfo = await getQQAuthInfo(options);
  } else {
    authInfo = await getWxAuthInfo(options);
  }
  return AV.User.loginWithMiniApp(authInfo);
};

Page({
  todos: [],
  data: {
    todos: [],
    editedTodo: {},
    draft: '',
    editDraft: null,
  },
  login: function() {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : loginFn({
      preferUnionId: true,
    }));
  },
  fetchTodos: function (user) {
    const query = new AV.Query(Todo)
      .equalTo('user', AV.Object.createWithoutData('User', user.id))
      .descending('createdAt');
    const setTodos = this.setTodos.bind(this);
    return AV.Promise.all([query.find().then(setTodos), query.subscribe()]).then(([todos, subscription]) => {
      this.subscription = subscription;
      if (this.unbind) this.unbind();
      this.unbind = bind(subscription, todos, setTodos);
    });
  },
  onReady: function() {
    console.log('page ready');
    this.login().then(this.fetchTodos.bind(this)).catch(error => console.error(error.message));
  },
  onUnload: function() {
    this.subscription.unsubscribe();
    this.unbind();
  },
  onPullDownRefresh: function () {
    const user = AV.User.current();
    if (!user) return wx.stopPullDownRefresh();
    this.fetchTodos(user).catch(error => console.error(error.message)).then(wx.stopPullDownRefresh);
  },
  setTodos: function (todos) {
    this.todos = todos;
    const activeCount = todos.filter(todo => !todo.done).length;
    this.setData(jsonify({
      todos,
      activeCount,
    }));
    return todos;
  },
  updateDraft: function ({
    detail: {
      value
    }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      draft: value
    });
  },
  addTodo: function () {
    var value = this.data.draft && this.data.draft.trim()
    if (!value) {
      return;
    }
    var acl = new AV.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(AV.User.current(), true);
    acl.setWriteAccess(AV.User.current(), true);
    new Todo({
      content: value,
      done: false,
      user: AV.User.current()
    }).setACL(acl).save().then((todo) => {
      this.setTodos([todo, ...this.todos]);
    }).catch(error => console.error(error.message));
    this.setData({
      draft: ''
    });
  },
  toggleDone: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    const { todos } = this;
    const currentTodo = todos.filter(todo => todo.id === id)[0];
    currentTodo.done = !currentTodo.done;
    currentTodo.save()
      .then(() => this.setTodos(todos))
      .catch(error => console.error(error.message));
  },
  editTodo: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    this.setData(jsonify({
      editDraft: null,
      editedTodo: this.todos.filter(todo => todo.id === id)[0] || {}
    }));
  },
  updateEditedContent: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      editDraft: value
    });
  },
  doneEdit: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    const { editDraft } = this.data;
    this.setData({
      editedTodo: {},
    });
    if (editDraft === null) return;
    const currentTodo = this.todos.filter(todo => todo.id === id)[0];
    if (editDraft === currentTodo.content) return;
    currentTodo.content = editDraft;
    currentTodo.save().then(() => {
      this.setTodos(this.todos);
    }).catch(error => console.error(error.message));
  },
  removeDone: function () {
    AV.Object.destroyAll(this.todos.filter(todo => todo.done)).then(() => {
      this.setTodos(this.todos.filter(todo => !todo.done));
    }).catch(error => console.error(error.message));
  },

  onShareAppMessage() {
    if (isQQApp) {
      wx.showShareMenu();
    }
  }
});
