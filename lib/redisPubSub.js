var redis = require('redis'),
  events = require('events');

/**
 * RedisPubSub - Simple Pub/Sub
 * @param options
 *          port - Redis Port
 *          host - Redis host
 *          connect_timeout - timeout
 *          max_attempts - max connection attempts
 *          pubClient - Redis pubClient
 *          subClient - Redis subClient
 * @constructor
 */
function RedisPubSub (options) {
  options = options || {};
  events.EventEmitter.call(this);
  this.host = options && options.host ? options.port : '127.0.0.1';
  this.port = options && options.port ? options.port : 6379;

  this.redisOptions = {
    connect_timeout : options && options.connect_timeout ? options.connect_timeout : false,
    max_attempts : options && options.max_attempts ? options.max_attempts : false
  };

  this.pubClient = options.pubClient || redis.createClient(this.port, this.host, this.redisOptions);
  this.subClient = options.subClient || redis.createClient(this.port, this.host, this.redisOptions);

  this.subscriptions = {};
  this.setupListeners();
};
RedisPubSub.prototype.__proto__ = events.EventEmitter.prototype;
RedisPubSub.prototype.setupListeners = function (cb) {
  this.on("removeListener", this._unsubscribe);
  this.on("newListener", this._subscribe);
};
RedisPubSub.prototype._subscribe = function(event, functino) {
  // Subscribe to event
  console.log("SUBSCRIBING TO", event);
  if (this.subscriptions[event]) {
    this.subscriptions[event]++;
  } else {
    this.subscriptions[event] = 1;
  }
  console.log(event, "count", this.subscriptions[event]);
};
RedisPubSub.prototype._unsubscribe = function(event, functino) {
  // Unsubscribe from event.
  console.log("UNSUBSCRIBING FROM", event);
  if (this.subscriptions[event]) {
    if (this.subscriptions[event] <= 1) {
      delete this.subscriptions[event];
    } else {
      this.subscriptions[event]--;
    }
  }
  console.log(event, "count", this.subscriptions[event]);
};
module.exports = RedisPubSub;

var f = new RedisPubSub();