import { ClaudePlugin } from '@claude-code/plugin-sdk';
import { Router } from './router/router.js';

export default class BankrRouterPlugin implements ClaudePlugin {
  private router: Router;

  constructor() {
    // Initialize router with your Bankr config path
    this.router = new Router({
      configPath: process.env.BANKR_CONFIG_PATH || '/etc/bankr/config.json',
    });
  }

  async activate() {
    console.log("[bankr-router] Plugin activated. Initializing smart router...");
    await this.router.initialize();
  }

  async dispose() {
    console.log("[bankr-router] Disposing plugin...");
    await this.router.cleanup();
  }

  // Intercept requests to the LLM Gateway
  async interceptRequest(request: any) {
    const route = await this.router.selectRoute(request);
    return {
      ...request,
      url: route.url,
      headers: {
        ...request.headers,
        'Authorization': `Bearer ${route.apiKey}`,
      },
    };
  }
}
