const fetchJSON = async (jsonStorageKey) => {

  const filepath = '/.assets/' + url(jsonStorageKey.replace('importJSON::', '')) + '.json';

  const response = await fetch(filepath);
  const importedJSON = await response.text();
  await localStorage.setItem(jsonStorageKey, importedJSON);
  await localStorage.setItem(jsonStorageKey + '::Timestamp', Date.now());

  const jsonStoredEvent = new Event('storeJSON');
  await window.dispatchEvent(jsonStoredEvent);
}


const importJSON = (filepath, callback, parameters = {}) => {

  const jsonStorageKey = 'importJSON::' + src(filepath.replace('/.assets/', '').replace('.json', ''));

  const storedJSON = localStorage.getItem(jsonStorageKey);

  const timeStamp = localStorage.getItem(jsonStorageKey + '::Timestamp');
  const timeLimit = (1000 * 60); // (1000 * 60 * 60 * 24 * 7);
  const timeElapsed = (Date.now() - timeStamp);


  // RETRIEVE FROM LOCALSTORAGE IF ENTRY EXISTS AND TIME LIMIT HAS NOT PASSED
  if ((storedJSON !== null) && (timeElapsed < timeLimit)) {

    return callback(storedJSON, parameters);
  }

  // FETCH JSON
  else {

    fetchJSON(jsonStorageKey);

    window.addEventListener('storeJSON', () => {

      const newStoredJSON = localStorage.getItem(jsonStorageKey);

      parameters.fetched = true;

      return callback(newStoredJSON, parameters);
    });
  }
}


export { importJSON };



<script type="module">

import { importJSON } from \'/json-import-test-3.js\';

const buildParagraphParameters = {color: \'rgba(255, 255, 255, 0.1)\'};

function buildParagraph(targetJSON, parameters) {

  let paragraph = document.createElement(\'p\');
  parameters.color = (parameters.fetched) ? \'rgba(255, 255, 255, 0.5)\' : parameters.color;
  paragraph.style.color = parameters.color;
  paragraph.textContent = JSON.parse(targetJSON).Document_Overview.Editorial_Elements.Page_Heading;
  document.body.appendChild(paragraph);
}

importJSON(\'/.assets/content/pages/'.url($Page).'/page.json\', buildParagraph, buildParagraphParameters);
</script>
