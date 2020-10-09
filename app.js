import * as LC from './lib/lc.min';
import * as wxAdapters from './lib/platform-adapters-weapp';
import * as qqAdapters from './lib/platform-adapters-qqapp';
import { LiveQuery } from './lib/live-query.min';
import { isQQApp } from './utils/index';

if (isQQApp) {
  LC.setAdapters(qqAdapters);
} else {
  LC.setAdapters(wxAdapters);
}

LC.use(LiveQuery);

LC.init({
  appId: 'ozewwcwsyq92g2hommuxqrqzg6847wgl8dtrac6suxzko333',
  appKey: 'ni0kwg7h8hwtz6a7dw9ipr7ayk989zo5y8t0sn5gjiel6uav',
  serverURL: 'https://ozewwcws.lc-cn-n1-shared.com',
})

//app.js
App({});
