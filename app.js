import * as LC from './lib/lc.min';
import * as adapters from './lib/platform-adapters-weapp';
import { LiveQuery } from './lib/live-query.min';

LC.setAdapters(adapters);
LC.use(LiveQuery);

LC.init({
  appId: 'ozewwcwsyq92g2hommuxqrqzg6847wgl8dtrac6suxzko333',
  appKey: 'ni0kwg7h8hwtz6a7dw9ipr7ayk989zo5y8t0sn5gjiel6uav',
  serverURL: 'https://ozewwcws.lc-cn-n1-shared.com',
})

//app.js
App({});
