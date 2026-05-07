import * as assistant from './assistant';
import * as event from './event';
import * as hub from './hub';
import * as system from './system';
import * as common from './common';
import * as admin from './admin';
import * as tenant from './tenant';
import * as v1platform from './v1platform';
import * as recharge from './recharge';
import * as withdraw from './withdraw';
import * as platformtools from './platformtools';
import * as report from './report';

export * from './core';

export const api = {
  assistant,
  event,
  hub,
  system,
  common,
  admin,
  tenant,
  v1platform,
  recharge,
  withdraw,
  platformtools,
  report
};

export default api;
