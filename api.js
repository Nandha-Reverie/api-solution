var axios = require('axios');

var keyCount = 0;

async function tes() {
  let arrCount = 0,
    key = 0;
  //   var dummyData = [
  //     { field: 'test', field1: 'Result', field2: 'additional' },
  //     { field: 'exam' },
  //     { field: ['how', 'are'] },
  //     { field: ['you', 'me'] }
  //   ];
  var dummyData = ['orange', 'two', 'three'];

  if (typeof dummyData[0] == 'object') {
    dummyData.forEach(async ele => {
      busy = true;
      await jsonHandler(ele, function(val, kVal) {
        arrCount += val;
        key += kVal;
        console.log('Key Count..', keyCount, key, arrCount);
        if (key == keyCount) {
          console.log('dummy data', dummyData);
        }
      });
    });
  } else if (typeof dummyData[0] == 'string') {
    dummyData.forEach(async ele => {
      let ind;
      ind = dummyData.indexOf(ele);
      await stringHandler(ele).then(res => {
        arrCount += 1;
        if (res) {
          console.log('res...');
          dummyData[ind] = res[ele.toLowerCase()];
          console.log('array count', arrCount, dummyData.length);
          if (arrCount == dummyData.length) {
            console.log('completed', dummyData);
          }
        }
      });
    });
  }
}

async function jsonHandler(json, cb) {
  let arrCount = 0;
  keyCount += Object.keys(json).length;
  for (const k in json) {
    if (json.hasOwnProperty(k)) {
      if (Array.isArray(json[k])) {
        json[k].forEach(async ele => {
          let ind;
          ind = json[k].indexOf(ele);
          await stringHandler(ele).then(res => {
            arrCount += 1;
            if (res) {
              console.log('res...');
              json[k][ind] = res[ele.toLowerCase()];
            }
            if (arrCount == json[k].length) {
              //   console.log('no of json arr', 1);
              //   console.log('no of json arr keys', 1);
              cb(1, 1);
            }
          });
        });
      } else if (typeof json[k] == 'string') {
        await stringHandler(json[k]).then(res => {
          console.log('JSON Strings...', json[k], res[json[k].toLowerCase()]);
          json[k] = res[json[k].toLowerCase()];
          //   console.log('no of json string', 1);
          //   console.log('no of json string key', 1);

          cb(1, 1);
        });
      }
    }
  }
}

async function stringHandler(str) {
  let tns = await fetch_transliteration([str], 'tamil');
  return (tns = { ...tns });
}

async function fetch_transliteration(data, target_lang) {
  // data = Array.from(new Set(data))
  // let post_url = "http://beta.auth.revup.reverieinc.com/apiman-gateway/Rev_app_devesh/localization/1.0?target_lang="+target_lang+"&source_lang=english&domain=2&nmt=false&segmentation=false&ignoreRosettaForMt=true&mt=false"
  let post_url =
    'http://beta.auth.revup.reverieinc.com/apiman-gateway/Rev_app_devesh/transliteration/1.0?target_lang=' +
    target_lang +
    '&source_lang=english&domain=2&convert_number=true';
  let response = await axios.post(
    post_url,
    { data: data },
    {
      headers: {
        'REV-API-KEY': 'fc294a1cfe56761a9b46b6f259db31d5',
        'REV-APP-ID': 'devesh_new_appid'
      }
    }
  );

  let localized = {};
  // let res = response.data.responseList.map( x => localized[x.inString.toLowerCase()] = x.outString)
  let res = response.data.responseList.map(
    x => (localized[x.inString.toLowerCase()] = x.outString[0])
  );
  return localized;
}

tes();
