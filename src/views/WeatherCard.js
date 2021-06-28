import React from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { ReactComponent as RainIcon } from './../images/rain.svg';
import { ReactComponent as AirFlowIcon } from './../images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './../images/refresh.svg';
import { ReactComponent as LoadingIcon } from './../images/loading.svg';
import WeatherIcon from './../components/WeatherIcon';
import { ReactComponent as CogIcon } from './../images/cog.svg';

const WeatherCardWrapper = styled.div`
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

const WeatherElement = styled.div`
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

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

//從props中取出handleCurrentPageChange
const WeatherCard = ({
  weatherElement,
  moment,
  fetchData,
  handleCurrentPageChange,
  cityName,
}) => {
  const {
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

  return (
    <>
      <WeatherCardWrapper>
        <Cog onClick={() => handleCurrentPageChange('WeatherSetting')} />
        <Location theme='light'>{cityName}</Location>
        <Description>
          {description}
          {comfortability}
        </Description>
        <WeatherElement>
          <Temperature>
            {/* Math.round()，做四捨五入 */}
            {Math.round(temperature)} <Celsius>°C</Celsius>
          </Temperature>
          {/* 把fetch到的資料給WeatherIcon元件 */}
          <WeatherIcon weatherCode={weatherCode} moment={moment} />
        </WeatherElement>
        <AirFlow>
          <AirFlowIcon /> {windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon /> {rainPossibility}%
        </Rain>
        {/* 原本用戶點擊重整，會呼叫fetchCurrentWeather、fetchWeatherForecast兩個函式 */}
        {/* 但兩個函式fetch資料會有時間差，所以使用promise.all整併在fetchData function中 */}
        <Refresh onClick={fetchData} isLoading={isLoading}>
          {/* // 將loading資料狀態帶入component中 */}
          最後觀測時間 : {/* Intl.DateTimeFormat可將時間格式化符合多語系呈現 */}
          {new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(observationTime))}{' '}
          {/* 使用dayjs處理跨瀏覽器時間問題 */}
          {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          {/* isLoading為true顯示loadingicon */}
        </Refresh>
      </WeatherCardWrapper>
    </>
  );
};

export default WeatherCard;
