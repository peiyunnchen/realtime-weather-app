import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as DayThunderstorm } from './../images/day-thunderstorm.svg';
import { ReactComponent as DayClear } from './../images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './../images/day-cloudy-fog.svg';
import { ReactComponent as DayCloudy } from './../images/day-cloudy.svg';
import { ReactComponent as DayFog } from './../images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../images/day-snowing.svg';
import { ReactComponent as NightThunderstorm } from './../images/night-thunderstorm.svg';
import { ReactComponent as NightClear } from './../images/night-clear.svg';
import { ReactComponent as NightCloudyFog } from './../images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudy } from './../images/night-cloudy.svg';
import { ReactComponent as NightFog } from './../images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../images/night-snowing.svg';

//  emotion套件，可以修改原本元件的樣子 const元件新名字=styled(舊元件名)css樣式
// const DayCloudy = styled(DayCloudyIcon)`
//   flex-basis: 30%;
// `;

// IconContainer取代上方的圖片樣式定義
const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

// 定義天氣代碼（weatherCode）和天氣型態（weatherType）之間的關係
const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
  ],
  isSnowing: [23, 37, 42],
};

// 根據「天氣型態」顯示對應的「天氣圖示」
const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

// 使用array.prototype.find迴圈，來找出該天氣代碼對應到的天氣型態
const weatherCode2Type = (weatherCode) => {
  const [weatherType] =
    Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
      weatherCodes.includes(Number(weatherCode))
    ) || [];

  return weatherType;
};
// // 假設從 API 取得的天氣代碼是 1
// const weatherCode = 1;
// console.log(weatherCode2Type(weatherCode)); // isClear

// 從母元件App.js得到資料，
const WeatherIcon = ({ weatherCode, moment }) => {
  // useMemo保存weatherCode2Type計算的結果，當weatherCode有變動時才重新運算
  const weatherType = useMemo(
    () => weatherCode2Type(weatherCode),
    [weatherCode]
  );
  // 將天氣代碼轉成天氣型態
  const weatherIcon = weatherIcons[moment][weatherType];
  // 根據天氣型態和moment得到對應的圖片
  return (
    <>
      <IconContainer>{weatherIcon}</IconContainer>
    </>
  );
};

export default WeatherIcon;
