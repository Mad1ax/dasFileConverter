import React, { useState } from 'react';
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
  const [covertedData, setConvertedData] = useState('');

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
      let latA = currentLat.slice(0, 2);
      let latB = currentLat.slice(2, 4);
      let latC = (Number(currentLat.slice(5, 9)) * 0.006).toFixed(1);
      let finalLat = latA + ' ' + latB + ' ' + latC;
      // console.log(latA,latB,latC);
      let currentLong = iteratedString[4].toString();
      let longA = currentLong.slice(0, 3);
      let longB = currentLong.slice(3, 5);
      let longC = (Number(currentLong.slice(6, 10)) * 0.006).toFixed(1);
      let finallong = longA + ' ' + longB + ' ' + longC;

      currentStringObject = {
        pointTime: currentTime,
        pointLatitude: finalLat,
        pointLongtitude: finallong,
      };
      totalDataArr.push(currentStringObject);
    });

    console.log(totalDataArr);
    setConvertedData(totalDataArr);
    setFileChecked(true);
    setCheckedFileName(loadedFileName);
  };

  //очистка содержимого
  const inputClear = () => {
    setInputValue('');
    setConvertedData('');
    setFileLoaded(false);
    setCheckedFileName(false);
    console.log('data cleared');
  };

  //загрузка текстового файла
  const fileLoader = (event) => {
    setFileLoaded(true);
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

    // let jsonConvertedData =
    writeFile(prompt('введите имя файла'), `${JSON.stringify(covertedData)}`);
  };

  let downloadTrack = () => {
    console.log('download track');
    let convertedTrack = '';
    covertedData.forEach((e) => {
      let pointCoord = e.pointLatitude + ';' + e.pointLongtitude + '\n';

      // convertedTrack.push(pointCoord)
      convertedTrack += pointCoord;
    });
    console.log(convertedTrack);
    let downloadedTrackFileName = loadedFileName.split('.')[0] + ' track';
    writeFile(downloadedTrackFileName, convertedTrack);
  };

  return (
    <>
      <h1 className='m-2 border-bottom text-center'>Конвертер .das файлов</h1>
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
              className='btn btn-success m-2 border-secondary'
              id='func-buttons'
              type='button'
              onClick={downloadData}
            >
              скачать обработанный файл
            </button>

            <button
              className='btn btn-success m-2 border-secondary'
              id='func-buttons'
              type='button'
              onClick={downloadTrack}
            >
              скачать обработанный трек
            </button>

            {/* <InfoBlock /> */}
          </div>
        </div>
      </form>
    </>
  );
};

export default App;
