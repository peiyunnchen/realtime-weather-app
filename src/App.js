import React from 'react';
import styled from '@emotion/styled';
// 把SVG圖片當成react 元件
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ThemeContext } from '@emotion/react';

// 使用emotion套件建立styled Component
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: {
    props=>props.theme==='dark'?'#dadada': '#212121';
  }
  margin-bottom: 20px;
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

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
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
  color: #828282;
  margin-bottom: 20px;
  /* 調整AirFlow中AirFlowIcon樣式 */
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
  color: #828282;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
  }
`;
// emotion套件，可以修改原本元件的樣子
// const 元件新名字=styled(舊元件名)`css樣式`
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

// 中央氣象局授權碼
const AUTHORIZATION_KEY = 'CWB-8A85A7A7-8AAB-4ADD-9CA0-F1569953C2C0';
const LOCATION_NAME = '臺北';

function App() {
  // handleClick函式呼叫中央氣象局API
  const handleClick = () => {
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('data', data);
        const locationData = data.records.location[0];
        // const weatherElements=locationData.weatherElement  //未完
      });
  };

  return (
    <>
      {/* 直接使用styled Component */}
      {/* 把主題色帶入 */}
      <Container theme={theme.dark}>
        <WeatherCard>
          <Location theme='dark'>台北市</Location>
          <Description>多雲時晴</Description>
          <CurrentWeather>
            <Temperature>
              23 <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> 23 m/h
          </AirFlow>
          <Rain>
            <RainIcon /> 48%
          </Rain>
          {/* 用戶點擊重整按鈕，呼叫handleClick函式 */}
          <Refresh onClick={handleClick}>
            最後觀測時間 : 上午12:03 <RefreshIcon />
          </Refresh>
        </WeatherCard>
      </Container>
    </>
  );
}

export default App;
