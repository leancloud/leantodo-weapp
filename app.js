const AV = require('./utils/av-live-query-core-min');
const adapter = require('./utils/platform-adapters-weapp');

AV.setAdapters(adapter);
AV.init({
  appId: 'ozewwcwsyq92g2hommuxqrqzg6847wgl8dtrac6suxzko333',
  appKey: 'ni0kwg7h8hwtz6a7dw9ipr7ayk989zo5y8t0sn5gjiel6uav',
  serverURLs: 'https://ozewwcws.lc-cn-n1-shared.com',
});

//app.js
App({});
