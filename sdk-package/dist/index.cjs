"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthProvider: () => AuthProvider,
  HttpTransport: () => HttpTransport,
  KernelRuntime: () => KernelRuntime,
  MiddlewarePipeline: () => MiddlewarePipeline,
  PluginManager: () => PluginManager,
  RetryPolicy: () => RetryPolicy,
  SurgicalKernelClient: () => SurgicalKernelClient,
  Telemetry: () => Telemetry
});
module.exports = __toCommonJS(index_exports);

// src/client/SurgicalKernelClient.ts
var SurgicalKernelClient = class {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  endpoint;
  async execute(request, options = {}) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (options.operationId) {
      headers["x-operation-id"] = options.operationId;
    }
    if (options.correlationId) {
      headers["x-correlation-id"] = options.correlationId;
    }
    if (options.idempotencyKey) {
      headers["idempotency-key"] = options.idempotencyKey;
    }
    const response = await fetch(
      `${this.endpoint}/v1/operations`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(
          request
        )
      }
    );
    return await response.json();
  }
};

// src/runtime/KernelRuntime.ts
var KernelRuntime = class {
  transport;
  middleware;
  telemetry;
  auth;
  retry;
  constructor(config) {
    this.transport = config.transport;
    this.middleware = config.middleware;
    this.telemetry = config.telemetry;
    this.auth = config.auth;
    this.retry = config.retry;
  }
  async execute(request) {
    const prepared = await this.middleware.before(
      request
    );
    const authenticated = await this.auth.authorize(
      prepared
    );
    const response = await this.retry.execute(
      () => this.transport.send(
        authenticated
      )
    );
    await this.telemetry.capture(
      authenticated,
      response
    );
    return await this.middleware.after(
      response
    );
  }
};

// src/runtime/http/HttpTransport.ts
var HttpTransport = class {
  endpoint;
  headers;
  constructor(config) {
    this.endpoint = config.endpoint;
    this.headers = config.headers ?? {};
  }
  async send(payload) {
    const response = await fetch(
      this.endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers
        },
        body: JSON.stringify(
          payload
        )
      }
    );
    if (!response.ok) {
      throw new Error(
        `Kernel request failed: ${response.status}`
      );
    }
    return await response.json();
  }
};

// src/runtime/middleware/MiddlewarePipeline.ts
var MiddlewarePipeline = class {
  middlewares;
  constructor() {
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(
      middleware
    );
    return this;
  }
  async before(request) {
    let result = request;
    for (const middleware of this.middlewares) {
      if (middleware.before) {
        result = await middleware.before(
          result
        );
      }
    }
    return result;
  }
  async after(response) {
    let result = response;
    for (const middleware of [
      ...this.middlewares
    ].reverse()) {
      if (middleware.after) {
        result = await middleware.after(
          result
        );
      }
    }
    return result;
  }
};

// src/runtime/auth/AuthProvider.ts
var AuthProvider = class {
  strategy;
  constructor(config = {}) {
    this.strategy = config.strategy;
  }
  async authorize(request) {
    if (!this.strategy) {
      return request;
    }
    return await this.strategy(
      request
    );
  }
};

// src/runtime/retry/RetryPolicy.ts
var RetryPolicy = class {
  retries;
  delay;
  constructor(config = {}) {
    this.retries = config.retries ?? 3;
    this.delay = config.delay ?? 500;
  }
  async execute(operation) {
    let attempt = 0;
    while (attempt <= this.retries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt > this.retries) {
          throw error;
        }
        await this.wait();
      }
    }
    throw new Error(
      "Retry execution failed"
    );
  }
  async wait() {
    return new Promise(
      (resolve) => setTimeout(
        resolve,
        this.delay
      )
    );
  }
};

// src/runtime/telemetry/Telemetry.ts
var Telemetry = class {
  collector;
  events;
  constructor(config = {}) {
    this.collector = config.collector;
    this.events = [];
  }
  async capture(request, response) {
    const event = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      request,
      response
    };
    this.events.push(
      event
    );
    if (this.collector) {
      await this.collector(
        event
      );
    }
    return event;
  }
  getEvents() {
    return this.events;
  }
};

// src/runtime/plugins/PluginManager.ts
var PluginManager = class {
  plugins;
  constructor() {
    this.plugins = [];
  }
  register(plugin) {
    this.plugins.push(
      plugin
    );
    return this;
  }
  async initialize(context) {
    for (const plugin of this.plugins) {
      if (plugin.initialize) {
        await plugin.initialize(
          context
        );
      }
    }
  }
  getPlugins() {
    return this.plugins;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthProvider,
  HttpTransport,
  KernelRuntime,
  MiddlewarePipeline,
  PluginManager,
  RetryPolicy,
  SurgicalKernelClient,
  Telemetry
});
