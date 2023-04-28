import React, {useState} from 'react'


const App = () => {
  const [jsonData, setJsonData] = useState(null);
  console.log(jsonData?.purchase_order['@attributes']);
 const [xmlData, setXmlData] = useState("");
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = async () => {
         const data = fileReader.result;
         setXmlData(data);
         const parser = new DOMParser();
         const xmlDoc = parser.parseFromString(data, "text/xml");
         const json = xmlToJson(xmlDoc);
        setJsonData(json);
    };
  };
    const xmlToJson = (xml) => {
      const obj = {};
      if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let i = 0; i < xml.attributes.length; i++) {
            const attribute = xml.attributes.item(i);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType === 3) {
        obj["#text"] = xml.nodeValue;
      }
      if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const item = xml.childNodes.item(i);
          const nodeName = item.nodeName;
          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof obj[nodeName].push === "undefined") {
              const old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
      return obj;
    };

  return (
    <div>
      <h1>Input</h1>
      <input type="file" accept=".xml" onChange={(e) => handleFileSelect(e)} />
      {jsonData ? (
        <div>
          <p>{jsonData?.purchase_order['@attributes'].account_code}</p>
        </div>
      ) : (
        <p>Please select an XML file.</p>
      )}
    </div>
  );
}

export default App



   