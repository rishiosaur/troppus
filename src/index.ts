import { signing_secret, token } from './config';
import { App } from "@slack/bolt";
import { filterDM, filterNoBotMessages, filterChannel } from './middleware/index';
import * as features from './features/index'

const app = new App({
    token: token,
    signingSecret: signing_secret
});

(async () => {
      // Start your appz
  await app.start(process.env.PORT || 3000);

  console.log('Troppus is running!');

  for (const [ feature, handler ] of Object.entries(features)) {
      handler(app);
      console.log(`Feature "${feature}" has been loaded.`)
  }
  
})()