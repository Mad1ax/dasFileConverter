import React, { useState } from 'react';
import LeafletMap from './components/map';
// import { indexOf } from 'lodash';
// import { getDistance } from 'geolib';
// import _ from 'lodash';

// import TableRow from './components/tableRow';
// import TableHead from './components/tableHead';
// import KmRow from './components/kmRow';
// import InfoBlock from './components/infoBlock';

//загрузка тогоже файла
//loader
//проверка на наличие данных в инпуте
//отправка данных

const App = () => {
  const [inputValue, setInputValue] = useState('');
  // const [culvertObjects, setCulvertObjects] = useState([]);
  // const [kmMarkerArr, setKmMarkerArr] = useState([]);
  // const [kmMarkerArrComponent, setKmMarkerArrComponent] = useState([]);
  // const [infoBlock, setInfoBlock] = useState(false);
  // const [kmMarkerArea, setKmMarkerArea] = useState([]);
  // const [numberVerifiedCulverts, setNumberVerifiedCulverts] = useState(0);
  const [isFileLoaded, setFileLoaded] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState('');
  const [isFileChecked, setFileChecked] = useState(false);
  const [checkedFileName, setCheckedFileName] = useState('');
  const [convertedData, setConvertedData] = useState('');
  const [markerData,setMarkerData] = useState([])
  const [mapContainerSettings, setMapContainerSettings]=useState({center:[56.483975, 84.956919],zoom:13,})

  let dataArr = [];
  let uniqGnggaStringsArr = [];

  //отслеживание изменения textarea
  const handleChange = (e) => setInputValue(e.target.value);

  //обработка и проверка данных
  const firstDataChecker = () => {
    dataArr = inputValue.trim().split(`\n`);

    //поиск уникальных строк
    dataArr.forEach((elem) => {
      if (elem.split(`,`)[0].includes('GNGGA')) {
        uniqGnggaStringsArr.push(elem);
      }
    });

    let currentStringObject = {};
    let totalDataArr = [];

    uniqGnggaStringsArr.forEach((uniqString) => {
      let iteratedString = uniqString.split(',');

      //обработка времени
      let currentTimeString = iteratedString[1].toString();
      let currentHour = currentTimeString.slice(0, 2);
      let currentMinute = currentTimeString.slice(2, 4);
      let currentSecond = currentTimeString.slice(4, 6);
      let currentTime = currentHour + ':' + currentMinute + ':' + currentSecond;

      //lat, long
      let currentLat = iteratedString[2].toString();
      // console.log(currentLat);
      // let latA = currentLat.slice(0, 2);
      // let latB = currentLat.slice(2, 4);
      // let latC = (Number(currentLat.slice(5, 9)) * 0.006).toFixed(1);
      // let finalLat = latA + ' ' + latB + ' ' + latC;


      let latA = currentLat.slice(0, 2);
      let latB = Number(currentLat.slice(2, 9))/60;
      let finalLat = (+latA + latB).toFixed(6).toString();
      // console.log(finalLat);


      // console.log(latA,latB,latC);
      let currentLong = iteratedString[4].toString();
      let longA = Number(currentLong.slice(0, 3));
      let longB = Number(currentLong.slice(3, 10))/60;
      // let longC = (Number(currentLong.slice(6, 10)) * 0.006).toFixed(1);
      // console.log(longA);

      let finallong = (+longA+longB).toFixed(6).toString();

      // console.log(longA,longB,finallong);

      currentStringObject = {
        pointTime: currentTime,
        pointLatitude: finalLat,
        pointLongtitude: finallong,
      };
      totalDataArr.push(currentStringObject);
    });

    console.log('проверяемый массив данных',totalDataArr);
    setConvertedData(totalDataArr);
    setFileChecked(true);
    setCheckedFileName(loadedFileName);
  };

  //очистка содержимого
  const inputClear = () => {
    setInputValue('');
    setConvertedData('');
    setFileLoaded(false);
    setFileChecked(false);
    setMarkerData([])
    setMapContainerSettings({center:[56.483975, 84.956919],zoom:13,})
    console.log('данные очищены');
  };

  //загрузка текстового файла
  const fileLoader = (event) => {
 
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      let currentTextareaValue = event.target.result;
      setInputValue('');
      setInputValue(currentTextareaValue);
    };

    console.log('загружаю файл', file.name);
    setLoadedFileName(file.name);
    reader.readAsText(file);
    setFileLoaded(true);
  };

  function writeFile(name, value) {
    let val = value;
    if (value === undefined) {
      val = '';
    }
    const download = document.createElement('a');
    download.href =
      'data:text/plain;content-disposition=attachment;filename=file,' + val;
    download.download = name;
    download.style.display = 'none';
    download.id = 'download';
    document.body.appendChild(download);
    document.getElementById('download').click();
    document.body.removeChild(download);
  }

  let downloadData = () => {
    console.log('download');
    writeFile(prompt('введите имя файла'), `${JSON.stringify(convertedData)}`);
    console.log('файл скачан');
  };

  let downloadTrack = () => {
    console.log('download track');
    let convertedTrack = '';
    convertedData.forEach((e) => {
      let pointCoord = e.pointLatitude + ';' + e.pointLongtitude + '\n';

      // convertedTrack.push(pointCoord)
      convertedTrack += pointCoord;
    });
    // console.log(convertedTrack);
    let downloadedTrackFileName = loadedFileName.split('.')[0] + ' track';
    writeFile(downloadedTrackFileName, convertedTrack);
  };
  
  const showOnMap =()=>{
    let markers=[]
    let markerObject = {}
    if (convertedData.length>0) {
      convertedData.forEach((e) => {
        markerObject = {
          geocode: [Number(e.pointLatitude), Number(e.pointLongtitude)],
          popup: e.pointLatitude + ' ' + e.pointLongtitude,
          key: e.pointTime,
        }
        markers.push(markerObject)
      });
    }
    setMarkerData(markers);
    console.log('маркеры отображены');

    // let currentMapCenter = markers[markers.length/2].geocode
    // console.log('geocent',currentMapCenter.geocode);

    // {center:[56.483975, 84.956919],zoom:13,}

    setMapContainerSettings({center:markers[markers.length/2].geocode,zoom:14,})
    // console.log('geocent',markers[markers.length/2].geocode,'zoom',);

    // console.log(markerData);
  }

  return (
    <>
    <div className='marginedContainer'>
      <h1 className='m-2 border-bottom text-center'>Конвертер .das файлов</h1>
      </div>
      <form action='' id='form'>
        <div className='inputContainer p-2'>
          <textarea
            className='form-control'
            id='inputText'
            name='inputText'
            placeholder='>>вставь данные сюда или выбери текстовый файл<<'
            rows='10'
            value={inputValue}
            onChange={handleChange}
          ></textarea>

          <div className=' buttonContainer p-2'>
            <div className='spanContainer'>
              <label className='input-file'>
                <input
                  type='file'
                  className='form-control'
                  id='inputGroupFile04'
                  aria-describedby='inputGroupFileAddon04'
                  onChange={fileLoader}
                  aria-label='Upload'
                />
                <span id='spanButton' className='bg-primary'>
                  выбрать файл
                </span>
              </label>
            </div>
            {isFileLoaded && (
              <div className='font-weight-bold'>загружен {loadedFileName}</div>
            )}

            <button
              className='btn btn-primary m-2 border-secondary'
              id='func-buttons'
              type='button'
              onClick={firstDataChecker}
            >
              проверить данные
            </button>
            {isFileChecked && (
              <div className='font-weight-bold'>проверен {checkedFileName}</div>
            )}
            <button
              className='btn btn-info m-2 border-secondary'
              type='button'
              id='func-buttons'
              onClick={inputClear}
            >
              очистить данные
            </button>

            <button
              className='btn btn-warning m-2 border-secondary'
              id='func-buttons'
              type='button'
              onClick={showOnMap}
              
            >
              отобразить на карте
            </button>


            <button
              className='btn btn-success m-2 border-secondary'
              id='func-buttons'
              type='button'
              onClick={downloadData}
            >
              скачать файл с временем
            </button>

            <button
              className='btn btn-success m-2 border-secondary'
              id='func-buttons'
              type='button'
              onClick={downloadTrack}
            >
              скачать трек
            </button>

            {/* <InfoBlock /> */}
          </div>
        </div>
      </form>

      <LeafletMap markers={markerData} markerCenter={mapContainerSettings}/>
      
    </>
  );
};

export default App;
