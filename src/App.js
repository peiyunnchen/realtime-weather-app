import React, { useState, useEffect, useMemo } from 'react';
// 引入emotion套件
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
// 匯入函式getMoment
import { getMoment } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';

// 使用emotion套件建立styled Component
const Container = styled.div`
  ${'' /* 變數要用${}包住，因為現在是包在``裡面 */}
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

function App() {
  // 中央氣象局授權碼
  const AUTHORIZATION_KEY = 'CWB-8A85A7A7-8AAB-4ADD-9CA0-F1569953C2C0';
  const LOCATION_NAME = '臺北';
  const LOCATION_NAME_FORECAST = '臺北市';
  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), []);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    cityName: LOCATION_NAME_FORECAST,
    authorizationKey: AUTHORIZATION_KEY,
  });

  const [currentTheme, setCurrentTheme] = useState('light');
  const {
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    isLoading,
    comfortability,
    weatherCode,
  } = weatherElement;

  // moment改變時主題才會變
  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <>
      {/* 直接使用styled Component */}
      {/* 把主題色帶入 */}
      <ThemeProvider theme={theme[currentTheme]}>
        <Container>
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
          />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
