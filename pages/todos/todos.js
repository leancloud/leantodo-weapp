const AV = require('../../utils/leancloud-storage');
const Todo = require('../../todo');

var filters = {
    all: function (todos) {
        return todos
    },
    active: function (todos) {
        return todos.filter(function (todo) {
            return !todo.done
        })
    },
    completed: function (todos) {
        return todos.filter(function (todo) {
            return todo.done
        })
    }
}

Page({
    data: {
        todos: [],
        editedTodo: null,
        draft: '',
    },
    onLoad: function () {
        Promise.resolve(AV.User.current()).then(user =>
            user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
        ).then(user =>
            user ? user : AV.User.loginWithWeapp()
        ).then((user) => {
            console.log('uid', user.id);
            return new AV.Query(Todo)
                .equalTo('user', AV.Object.createWithoutData('User', user.id))
                .descending('createdAt')
                .find()
                .then((todos) => {
                    this.setData({
                        todos
                    });
                });
        }).catch(error => console.error(error.message));
    },
    updateDraft: function ({
        detail: {
            value
        }
    }) {
        console.log(value);
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
            this.setData({
              todos: [todo, ...this.data.todos]
            });
        }).catch(console.error);
        this.setData({
          draft: ''
        });
    },
    editTodo: function ({
        target: {
            dataset: {
                id
            }
        }
    }) {
        console.log(id);
        this.setData({
            editedTodo: this.data.todos.filter(todo => todo.id === id)[0]
        });
    },
    doneEdit: function (e) {
        console.log(e);
    }
})