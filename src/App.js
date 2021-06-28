import React, { useState, useEffect, useMemo } from 'react';
// 引入emotion套件
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
// 匯入函式getMoment
import { getMoment } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting';
import { findLocation } from './utils/helpers';

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
  const [currentTheme, setCurrentTheme] = useState('light');
  // 定義畫面顯示狀態，好讓畫面進行切換
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  // 把修改頁面狀態的方法包在函式裡，再利用props傳給子元件WeatherCard
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  // 若localStorage有值就拿，沒有就預設臺北市
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  // 定義當前的城市，把localStorage的值設為預設
  const [currentCity, setCurrentCity] = useState(storageCity);
  // 取得當前的locationname，使用useMemo，當currentCity沒改變時不用重新call findLocation函式
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  // 再利用解構賦值取currentLocation資料
  const { cityName, locationName, sunriseCityName } = currentLocation;
  // 把setCurrentCity包在函式中props給子元件
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  // 中央氣象局授權碼
  const AUTHORIZATION_KEY = 'CWB-8A85A7A7-8AAB-4ADD-9CA0-F1569953C2C0';
  // const LOCATION_NAME = '臺北';
  // const LOCATION_NAME_FORECAST = '臺北市';
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
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
          {/* 當current狀態為WeatherCard時，就顯示weatherCard */}
          {/* &&前面為true，執行後面動作 */}
          {currentPage === 'WeatherCard' && (
            <WeatherCard
              cityName={cityName}
              weatherElement={weatherElement}
              moment={moment}
              fetchData={fetchData}
              handleCurrentPageChange={handleCurrentPageChange}
            />
          )}
          {/* 當current狀態為WeatherSetting時，就顯示WeatherSetting */}
          {currentPage === 'WeatherSetting' && (
            <WeatherSetting
              cityName={cityName}
              handleCurrentPageChange={handleCurrentPageChange}
              handleCurrentCityChange={handleCurrentCityChange}
            />
          )}
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
