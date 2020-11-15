# `importJSON()` for Ashiva

`importJSON()` is a core component for **Ashiva**.

**Ashiva** employs a _JSON-everywhere_ approach to storing data, so it benefits from having a fast, standard library approach for importing individual JSON files.

Unlike `requestRemoteResponse()`, its general-purpose counterpart, `importJSON()` is exclusively focused on importing JSON files.

Additionally, despite sharing a similar syntax with its counterpart, `importJSON()` is largely synchronous, includes offline capability and site-wide scope.

## Comparing `importJSON()` and `requestRemoteResponse()`, side-by-side:
    
**General Purpose:** `requestRemoteResponse('/.assets/content/pages/about-us/page.json', buildParagraph, {color: 'rgb(0, 125, 0)'});`

**JSON only:** `importJSON('/.assets/content/pages/about-us/page.json', buildParagraph, {color: 'rgb(0, 125, 0)'});`

## Notable differences between `importJSON()` and `requestRemoteResponse()`:

 - `importJSON()` uses **Fetch API**, while `requestRemoteResponse()` uses **XHR2**
 - `importJSON()` not only uses **Fetch API**, but does so with **ES2017** `async` / `await` syntax
 - `importJSON()` only fetches asynchronously from the server once, after which it retrieves JSON from `localStorage` (until the `localStorage` entry is refreshed)
 -
 -
 -
    
 ## Similarities between `importJSON()` and `requestRemoteResponse()`:
 
  - Both `importJSON()` and `requestRemoteResponse()` take **Callback Functions**
