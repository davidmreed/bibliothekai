import { registerDecorators as _registerDecorators } from "lwc";
// Wire adapters follow LWC types, which come from a non-portable module
// eslint-disable-next-line lwr/only-allowed-type-imports
function validateProvider(obj) {
  if (obj === undefined || obj === null) {
    throw new TypeError('Provider must be defined.');
  }
}
/**
 * Manages context for various providers
 */

export class ContextInfo {
  /**
   * The default value to be returned in the absence of a defined context
   */

  constructor(defaultValue) {
    this.infoMap = new WeakMap();
    this.defaultValue = defaultValue;
  }
  /**
   * Gets the stored info for a context provider
   * @param targetProvider the context provider
   */

  getInfo(targetProvider) {
    let info = this.infoMap.get(targetProvider);
    if (info === undefined) {
      info = {
        consumers: new Set()
      };
      this.infoMap.set(targetProvider, info);
    }
    return info;
  }
  /**
   * Set the context value directly associated with the target as a context provider.
   *
   * @param {Object} targetProvider
   * @param {FeatureContext} contextValue
   */

  setContext(targetProvider, contextValue) {
    validateProvider(targetProvider);
    const value = contextValue;
    const info = this.getInfo(targetProvider);
    info.contextValue = contextValue;
    info.consumers.forEach(consumer => consumer.provide(value));
    if (info.consumers.size === 0 && value?.onComplete) {
      // Ensure that wire callbacks are executed even if the wire has 0 subscribers
      value.onComplete();
    }
  }
  /**
   * Get the context value directly associated with the target as a context provider.
   *
   * @param {Object} targetProvider
   */

  getContext(targetProvider) {
    validateProvider(targetProvider);
    const {
      contextValue
    } = this.getInfo(targetProvider);
    return contextValue !== undefined ? contextValue : this.defaultValue;
  }
  /**
   * Clear the context value and registered subscribers directly associated with the
   * target as a context provider.
   *
   * @param {Object} targetProvider
   */

  clearContext(targetProvider) {
    validateProvider(targetProvider);
    this.infoMap.delete(targetProvider);
  }
  /**
   * Subscribe a consumer to the context value directly associated with the target as
   * a context provider. Calls to #set(targetProvider, contextValue) with the same
   * target will invoke the consumer.provide(contextValue) function.
   *
   * NOTE: Mutations to the contextValue directly do not result in calls to
   * consumer.provide(contextValue).
   *
   * @param {Object} targetProvider
   * @param {ContextConsumer} consumer object with a provide(context) function property.
   */

  subscribeContext(targetProvider, consumer) {
    validateProvider(targetProvider);
    const {
      consumers,
      contextValue
    } = this.getInfo(targetProvider);
    if (!consumers.has(consumer)) {
      consumers.add(consumer);
      consumer.provide(contextValue);
    }
  }
  /**
   * Unsubscribe a previously subscribed consumer from listening to changes on the
   * target
   * @param {Object} targetProvider
   * @param {ContextConsumer} consumer
   */

  unsubscribeContext(targetProvider, consumer) {
    validateProvider(targetProvider);
    this.getInfo(targetProvider).consumers.delete(consumer);
  }
}
_registerDecorators(ContextInfo, {
  fields: ["infoMap"]
});