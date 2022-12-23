# Notes

Your root container (in server-side routes) and your home component are _different components_.

The routing examples are not at all clear about how you get parameters in Lightning components that implement pages. It's the `CurrentPageReference` wire adapter.

Direct-linking to a page routed by client-side routing doesn't seem to work? To do full client-side routing with deep linking, need to do

```js
    "routes": [
        {
            "id": "app",
            "path": "/*",
            "rootComponent": "bib/app",
            "layoutTemplate": "$layoutsDir/base.html",
            "bootstrap": {
                "syntheticShadow": true
            }
        }
    ]
```


We have two types of page that have special views: the Text, and the Volume. All other pages are essentially filter views. They filter content (the Author, Publisher, and Series pages) while providing context (the author details, for example).

We need editability on the front end for everything!