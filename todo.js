const AV = require('./utils/leancloud-storage');

class Todo extends AV.Object {}
AV.Object.register(Todo);

module.exports = Todo;