# `importJSON()` for Ashiva

`importJSON()` is a core component for **Ashiva**.

**Ashiva** employs a _JSON-everywhere_ approach to storing data, so it entirely makes sense that **Ashiva** should have a fast, standardised approach for importing individual JSON files.

Unlike `requestRemoteResponse()`, its general-purpose counterpart, `importJSON()` is exclusively focused on importing JSON files.

Additionally, despite sharing a similar syntax with its counterpart, `importJSON()` is largely synchronous, includes offline capability and site-wide scope.

_____

## `importJSON()` Code:

### `fetchJSON()` (async)

```
async function fetchJSON(jsonStorageKey) {

  const filepath = '/.assets/' + url(jsonStorageKey.replace('importJSON::', '')) + '.json';

  const response = await fetch(filepath);
  const importedJSON = await response.text();
  await localStorage.setItem(jsonStorageKey, importedJSON);
  await localStorage.setItem(jsonStorageKey + '::Timestamp', Date.now());

  const jsonStoredEvent = new Event('storeJSON');
  await window.dispatchEvent(jsonStoredEvent);
}
```

### `importJSON()` (sync)

```
function importJSON(filepath, callback, parameters = {}) {

  const jsonStorageKey = 'importJSON::' + src(filepath.replace('/.assets/', '').replace('.json', ''));

  const storedJSON = localStorage.getItem(jsonStorageKey);

  const timeStamp = localStorage.getItem(jsonStorageKey + '::Timestamp');
  const timeLimit = (1000 * 60); // (1000 * 60 * 60 * 24 * 7);
  const timeElapsed = (Date.now() - timeStamp);


  // RETRIEVE JSON FROM LOCALSTORAGE (IF ENTRY & TIME LIMIT PERMIT) 
  if ((storedJSON !== null) && (timeElapsed < timeLimit)) {

    parameters.importJSONOrigin = 'local';
    return callback(storedJSON, parameters);
  }

  // ELSE FETCH JSON
  else {

    fetchJSON(jsonStorageKey);

    window.addEventListener('storeJSON', () => {

      const newStoredJSON = localStorage.getItem(jsonStorageKey);
      parameters.importJSONOrigin = 'remote';
      return callback(newStoredJSON, parameters);
    });
  }
}
```

_____

## Comparing `importJSON()` and `requestRemoteResponse()`, side-by-side:
    
### General Purpose:

    requestRemoteResponse(
    
      '/.assets/content/pages/about-us/page.json',      // <= filepath
      buildParagraph,                                   // <= callback
      {color: 'rgb(0, 125, 0)'}                         // <= parameters
      
    );

### JSON only:

    importJSON(
    
      '/.assets/content/pages/about-us/page.json',      // <= filepath
      buildParagraph,                                   // <= callback
      {color: 'rgb(0, 125, 0)'}                         // <= parameters
      
    );

## Advantages of `importJSON()` over `requestRemoteResponse()`:

 - `importJSON()` has a degree of offline capability while `requestRemoteResponse()` lacks any offline capability

 - `importJSON()` uses **Fetch API**, while `requestRemoteResponse()` uses **XHR2**
 
 - `importJSON()` not only uses **Fetch API**, but does so with **ES2017** `async` / `await` syntax
 
 - `importJSON()` fetches **JSON** asynchronously from the server _only once_, after which it repeatedly retrieves **JSON** from `localStorage` (until the `localStorage` entry is refreshed); in contrast `requestRemoteResponse()` _always_ makes an asynchronous request to the server
 
 
 ## Advantages of `requestRemoteResponse()` over `importJSON()`:
 
 - `requestRemoteResponse()` may request any type of file, while `importJSON()` is designed to fetch only **JSON** files
 
 - `requestRemoteResponse()` may request any _dynamic_ files, while `importJSON()` is designed to fetch only _static_ files
 
 - `requestRemoteResponse()` may initiate server-side processes, while `importJSON()` is designed to fetch only _static_ **JSON** files
 
    
 ## Similarities between `importJSON()` and `requestRemoteResponse()`:
 
  - Both `importJSON()` and `requestRemoteResponse()` employ **Callback Functions**
