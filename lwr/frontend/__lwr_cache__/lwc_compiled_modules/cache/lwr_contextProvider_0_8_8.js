import { createContextProvider } from 'lwc';
import { hasDocument } from 'lwr/routerUtils';
import { CurrentPageReference, CurrentView, NavigationContext } from 'lwr/navigation';
// Creating a context with LWC requires eventing APIs, which are not available from "@lwc/engine-server"
export const currentPageReferenceContextualizer = hasDocument ? createContextProvider(CurrentPageReference) : undefined;
export const currentViewContextualizer = hasDocument ? createContextProvider(CurrentView) : undefined;
export const navigationContextContextualizer = hasDocument ? createContextProvider(NavigationContext) : undefined;
/**
 *
 * @param {TContext} contextValue - Context API object
 * @param {EventTarget} providerNode - Context DOM element
 * @param {Contextualizer} contextualizer - Function for providing this context to subtree nodes wired to a specific adapter
 * @param {ContextualWireAdapter<TContext, TEmit, TConfig>} contextualAdapter - Contextual wire adapter capable of subscribing to context changes
 */

export function provideContext(contextValue, providerNode, contextualizer, contextualAdapter) {
  if (contextualizer && contextualAdapter) {
    // Set up provider to give context to wire adpaters so that a component connected
    // under the providerNode subtree and wired to those adapters will receive this id
    contextualAdapter.setContext(providerNode, contextValue);
    contextualizer(providerNode, {
      consumerConnectedCallback: contextualAdapter.subscribeContext.bind(contextualAdapter, providerNode),
      consumerDisconnectedCallback: contextualAdapter.unsubscribeContext.bind(contextualAdapter, providerNode)
    });
  }
}