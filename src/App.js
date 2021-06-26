import React, { useState, useEffect } from 'react';
// 引入emotion套件
import styled from '@emotion/styled';
// 把SVG圖片當成react 元件
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ThemeProvider } from '@emotion/react';
// 引入dayjs處理跨瀏覽器時間問題
import dayjs from 'dayjs';
import { ReactComponent as LoadingIcon } from './images/loading.svg';

// 使用emotion套件建立styled Component
const Container = styled.div`
  ${'' /* 變數要用${}包住，因為現在是包在``裡面 */}
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  ${'' /* 下方ThemeProvider帶有母元件給的theme=dark的資料 */}
  ${'' /* 這裡將母元件給的theme從props中拿出來用 */}
  ${'' /* 變數要用${}包住，因為現在是包在``裡面 */}
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  ${'' /* 這裡將母元件給的theme從props中拿出來用 */}
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  ${'' /* 用@keyframe取名為rotate定義旋轉動畫為了給loadingicon使用 */}
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    ${'' /* 用animation屬性套用rotate動畫效果在svg圖片上 */}
    animation-duration:${({ isLoading }) => (isLoading ? '1.5s' : '0s')}
    ${'' /* 判斷是否套用動畫isLoading為true才旋轉 */}
`;

// 定義深/淺主題css樣式
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};
// emotion套件，可以修改原本元件的樣子
// const 元件新名字=styled(舊元件名)`css樣式`
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

// 中央氣象局授權碼
const AUTHORIZATION_KEY = 'CWB-8A85A7A7-8AAB-4ADD-9CA0-F1569953C2C0';
const LOCATION_NAME = '臺北';

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '臺北市',
    description: '多雲時晴',
    windSpeed: 1.1,
    temperature: 22.9,
    rainPossibility: 48.3,
    observationTime: '2020-12-12 22:10:00',
    isLoading: true,
    // loading狀態
  });
  const {
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    isLoading,
  } = currentWeather;

  // fetchCurrentWeather函式呼叫中央氣象局API
  const fetchCurrentWeather = () => {
    // setCurrentWeather不只可以改變資料，還可以取得改變前的資料，慣例將前一次的資料取名為prevState
    setCurrentWeather((prevState) => ({ ...prevState, isLoading: true }));

    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const locationData = data.records.location[0];
        // 將風速、氣溫資料取出
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );
        setCurrentWeather({
          observationTime: locationData.time.observationTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          winSpeed: weatherElements.WDSD,
          description: '多雲時晴',
          rainPossibility: 60,
          isLoading: false,
          // 拉完資料後將loading改為false
        });
      });
  };
  // 頁面載入時就呼叫API拉新資料
  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  return (
    <>
      {/* 直接使用styled Component */}
      {/* 把主題色帶入 */}
      <ThemeProvider theme={theme[currentTheme]}>
        <Container>
          <WeatherCard>
            <Location theme='dark'>{locationName}</Location>
            <Description>{description}</Description>
            <CurrentWeather>
              <Temperature>
                {/* Math.round()，做四捨五入 */}
                {Math.round(temperature)} <Celsius>°C</Celsius>
              </Temperature>
              <DayCloudy />
            </CurrentWeather>
            <AirFlow>
              <AirFlowIcon /> {windSpeed} m/h
            </AirFlow>
            <Rain>
              <RainIcon /> {rainPossibility}%
            </Rain>
            {/* 用戶點擊重整按鈕，呼叫fetchCurrentWeather函式 */}
            <Refresh
              onClick={fetchCurrentWeather}
              isLoading={isLoading}
              // 將loading資料狀態帶入component中
            >
              最後觀測時間 :{' '}
              {/* Intl.DateTimeFormat可將時間格式化符合多語系呈現 */}
              {new Intl.DateTimeFormat('zh-TW', {
                hour: 'numeric',
                minute: 'numeric',
              }).format(dayjs(observationTime))}{' '}
              {/* 使用dayjs處理跨瀏覽器時間問題 */}
              {isLoading ? <LoadingIcon /> : <RefreshIcon />}
              {/* isLoading為true顯示loadingicon */}
            </Refresh>
          </WeatherCard>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
