import { isQQApp } from '../../utils/index';
import bind from '../../utils/live-query-binding';
import { ACL } from '../../utils/lc.min';

const { db } = getApp();
const User = db.class('_User');
const Todo = db.class('Todo');

Page({
  todos: [],
  data: {
    todos: [],
    editedTodo: {},
    draft: '',
    editDraft: null,
  },
  login: async function() {
    if (User.current()) {
      const currentUser = User.current();
      if (await currentUser.isAuthenticated()) {
        return currentUser;
      }
    }
    return User.logInWithMiniApp({ preferUnionId: true });
  },
  fetchTodos: async function (user) {
    const query = Todo.where('user', '==', user).orderBy('createdAt', 'desc');
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
    const user = User.current();
    if (!user) return wx.stopPullDownRefresh();
    this.fetchTodos(user).finally(wx.stopPullDownRefresh);
  },
  setTodos: function (todos) {
    this.todos = todos;
    const activeCount = todos.filter(todo => !todo.data.done).length;
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
    const acl = new ACL();
    acl.allow(User.current(), 'read');
    acl.allow(User.current(), 'write');
    const todo = await Todo.add({
      content: value,
      done: false,
      user: User.current(),
      ACL: acl,
    });
    this.setTodos([todo, ...this.todos]);
    this.setData({ draft: '' });
  },
  toggleDone: async function ({ target: { dataset: { id } } }) {
    const { todos } = this;
    const currentTodo = todos.filter(todo => todo.id === id)[0];
    currentTodo.data.done = !currentTodo.data.done;
    await currentTodo.update({ done: currentTodo.data.done });
    this.setTodos(todos);
  },
  editTodo: function ({ target: { dataset: { id } } }) {
    const currentTodo = this.todos.filter(todo => todo.id === id)[0];
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
    const currentTodo = this.todos.filter(todo => todo.id === id)[0];
    if (editDraft === null || editDraft === currentTodo.data.content) {
      return;
    }
    currentTodo.data.content = editDraft;
    await currentTodo.update({ content: editDraft });
    this.setTodos(this.todos);
  },
  removeDone: async function () {
    const doneTodos = this.todos.filter(todo => todo.data.done);
    await Promise.all(doneTodos.map(todo => todo.delete()));
    this.setTodos(this.todos.filter(todo => !todo.done));
  },
  onShareAppMessage() {
    if (isQQApp) {
      wx.showShareMenu();
    }
  }
});
