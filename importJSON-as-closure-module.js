const ashiva = (() => {

    //*******************************//
   // importJSON :: PRIVATE OBJECTS //
  //*******************************//

  const importJSONMethods = {

    getJSONStorageKey: (filepath) => {

      let jsonStorageKey = 'importJSON::' + src(filepath.replace('/.assets/', '').replace('.json', ''));

      return jsonStorageKey;
    },


    getFilepath: (jsonStorageKey) => {

      let filepath = '/.assets/' + url(jsonStorageKey.replace('importJSON::', '')) + '.json';

      return filepath;
    },


    fetchJSON: async (jsonStorageKey) => {

      const filepath = importJSONMethods.getFilepath(jsonStorageKey);

      const response = await fetch(filepath);
      const importedJSON = await response.text();
      await localStorage.setItem(jsonStorageKey, importedJSON);
      await localStorage.setItem(jsonStorageKey + '::Timestamp', Date.now());

      const jsonStoredEvent = new Event('storeJSON');
      await window.dispatchEvent(jsonStoredEvent);
    }
  };


  const importJSONProperties = {

    timeLimit: (1000 * 60) // (1000 * 60 * 60 * 24 * 7)
  };



    //******************************//
   // importJSON :: PUBLIC OBJECTS //
  //******************************//

  const importJSON = (filepath, callback, parameters = {}) => {

    const jsonStorageKey = importJSONMethods.getJSONStorageKey(filepath);
    const storedJSON = localStorage.getItem(jsonStorageKey);
    const timeStamp = localStorage.getItem(jsonStorageKey + '::Timestamp');
    const timeElapsed = (Date.now() - timeStamp);

    // RETRIEVE JSON FROM LOCALSTORAGE (IF ENTRY & TIME LIMIT PERMIT) 
    if ((storedJSON !== null) && (timeElapsed < importJSONProperties.timeLimit)) {

      parameters.origin = 'local';
      return callback(storedJSON, parameters);
    }

    // ELSE FETCH JSON
    else {

      importJSONMethods.fetchJSON(jsonStorageKey);

      window.addEventListener('storeJSON', () => {

        const newStoredJSON = localStorage.getItem(jsonStorageKey);
        parameters.origin = 'remote';
        return callback(newStoredJSON, parameters);
      });
    }
  };


  return { importJSON };

})();



// WORKING EXAMPLE:

const buildParagraphParameters = {color: 'rgb(0, 125, 0)'};

function buildParagraph(targetJSON, parameters) {

  let paragraph = document.createElement('p');
  parameters.color = (parameters.origin === 'remote') ? 'rgb(255, 0, 0)' : parameters.color;
  paragraph.style.color = parameters.color;
  paragraph.textContent = targetJSON;

  document.body.appendChild(paragraph);
}

ashiva.importJSON('/.assets/content/pages/about-us/page.json', buildParagraph, buildParagraphParameters);
