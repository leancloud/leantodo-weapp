import AV from './lib/av-live-query-core';
import * as wxAdapters from './lib/platform-adapters-weapp';
import * as qqAdapters from './lib/platform-adapters-qqapp';
import { isQQApp } from './utils/index';

if (isQQApp) {
  AV.setAdapters(qqAdapters);
} else {
  AV.setAdapters(wxAdapters);
}

AV.init({
  appId: 'ozewwcwsyq92g2hommuxqrqzg6847wgl8dtrac6suxzko333',
  appKey: 'ni0kwg7h8hwtz6a7dw9ipr7ayk989zo5y8t0sn5gjiel6uav',
  serverURL: 'https://ozewwcws.lc-cn-n1-shared.com',
})

//app.js
App({});
