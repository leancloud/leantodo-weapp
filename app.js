import * as LC from './utils/lc.min';
import * as adapters from './utils/platform-adapters-weapp';
import { LiveQuery } from './utils/live-query.min';

LC.setAdapters(adapters);
LC.use(LiveQuery);

const lcApp = new LC.App({
  appId: 'ozewwcwsyq92g2hommuxqrqzg6847wgl8dtrac6suxzko333',
  appKey: 'ni0kwg7h8hwtz6a7dw9ipr7ayk989zo5y8t0sn5gjiel6uav',
  serverURL: 'https://ozewwcws.lc-cn-n1-shared.com',
})
const db = new LC.Storage(lcApp);

//app.js
App({ lcApp, db });
