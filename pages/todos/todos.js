import { isQQApp } from '../../utils/index';
import bind from '../../utils/live-query-binding';
import AV from '../../lib/av-live-query-core';

Page({
  todos: [],
  data: {
    todos: [],
    editedTodo: {},
    draft: '',
    editDraft: null,
  },
  login: async function() {
    if (AV.User.current()) {
      const currentUser = AV.User.current();
      if (await currentUser.isAuthenticated()) {
        return currentUser;
      }
    }
    return AV.User.loginWithWeapp({ preferUnionId: true });
  },
  fetchTodos: async function (user) {
    const query = new AV.Query('Todo')
      .equalTo('user', user)
      .descending('createdAt');
    const todos = await query.find();
    this.setTodos(todos);

    const subscription = await query.subscribe();
    if (this.unbind) this.unbind();
    this.subscription = subscription;
    this.unbind = bind(subscription, todos, this.setTodos.bind(this));
  },
  onReady: function() {
    this.login().then(user => this.fetchTodos(user));
  },
  onUnload: function() {
    this.unbind();
    this.subscription.unsubscribe();
  },
  onPullDownRefresh: function () {
    const user = AV.User.current();
    if (!user) return wx.stopPullDownRefresh();
    this.fetchTodos(user).finally(wx.stopPullDownRefresh);
  },
  setTodos: function (todos) {
    this.todos = todos;
    const activeCount = todos.filter(todo => !todo.get('done')).length;
    this.setData({
      activeCount,
      todos: todos.map(todo => todo.toJSON()),
    });
  },
  updateDraft: function ({ detail: { value } }) {
    if (value) {
      // Android 真机上会诡异地触发多次使 value 为空的事件
      this.setData({ draft: value });
    }
  },
  addTodo: async function () {
    const value = this.data.draft && this.data.draft.trim()
    if (!value) {
      return;
    }
    const acl = new AV.ACL();
    acl.setReadAccess(AV.User.current(), true);
    acl.setWriteAccess(AV.User.current(), true);
    const todo = new AV.Object('Todo');
    todo.setACL(acl);
    await todo.save({
      content: value,
      done: false,
      user: AV.User.current(),
    });
    this.setTodos([todo, ...this.todos]);
    this.setData({ draft: '' });
  },
  toggleDone: async function ({ target: { dataset: { id } } }) {
    const currentTodo = this.todos.find(todo => todo.id === id);
    currentTodo.set('done', !currentTodo.get('done'));
    await currentTodo.save();
    this.setTodos(todos);
  },
  editTodo: function ({ target: { dataset: { id } } }) {
    const currentTodo = this.todos.find(todo => todo.id === id);
    this.setData({
      editDraft: null,
      editedTodo: currentTodo.toJSON(),
    });
  },
  updateEditedContent: function ({ detail: { value } }) {
    this.setData({ editDraft: value });
  },
  doneEdit: async function ({ target: { dataset: { id } } }) {
    this.setData({ editedTodo: {} });
    const { editDraft } = this.data;
    const currentTodo = this.todos.find(todo => todo.id === id);
    if (editDraft === null || editDraft === currentTodo.get('content')) {
      return;
    }
    currentTodo.set('content', editDraft);
    await currentTodo.save();
    this.setTodos(this.todos);
  },
  removeDone: async function () {
    const doneTodos = this.todos.filter(todo => todo.get('done'));
    await AV.Object.destroyAll(doneTodos);
    this.setTodos(this.todos.filter(todo => !todo.get('done')));
  },
  onShareAppMessage() {
    if (isQQApp) {
      wx.showShareMenu();
    }
  }
});
