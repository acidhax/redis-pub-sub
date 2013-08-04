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
}
wormhole.prototype.__proto__ = events.EventEmitter.prototype;
RedisPubSub.prototype.setupListeners = function (cb) {
  this.on("newListener", function (event) {
    // Capture new listener events... to subscribe to new channels!
    this.subscribe(event);
  });
  this.on("removeListener", function (event) {
    // Capture removal of listener events... to unsubscribe from channels!
    if (this.subscriptions[event] && this.subscriptions[event] <= 1) {
      delete this.subscriptions[event];
    } else {
      this.subscriptions[event]--;
    }
  });
};
RedisPubSub.prototype._subscribe = function(event) {
  // Subscribe to event
};
RedisPubSub.prototype._unsubscribe = function(event) {
  // Unsubscribe from event.
};
RedisPubSub.prototype.publish = function(channel) {
  // Publish to channel
  var args = [].slice.call(arguments).slice(1);
  // Publish to 'channel' with arguments
};
module.exports = RedisPubSub;