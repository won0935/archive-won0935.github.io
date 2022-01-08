import React from 'react';
import { TiAdjustBrightness } from 'react-icons/ti';
import Switch from 'react-switch';
import styled from 'styled-components';
import { useDarkMode } from '../models/useDarkMode';

const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  cursor: pointer;

  .icon-sun {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #222;
  }

  .icon-moon {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
  }
`;

const SunIcon = () => {
  return (
    <div className="icon-sun uncheckedIcon">
      <TiAdjustBrightness size="24" />
    </div>
  );
};

const MoonIcon = () => {
  return (
    <div className="icon-moon checkedIcon">
      <svg width="24" height="24" fill="#EFDC05">
        <rect width="24" height="24" fill="none" rx="0" ry="0" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.8102 3.2H13.8202C13.4902 3.2 13.2302 2.93 13.2302 2.6C13.2302 2.27 13.5002 2 13.8302 2H16.2602C16.5002 2 16.7202 2.15 16.8102 2.37C16.9002 2.59 16.8502 2.85 16.6802 3.02L15.2702 4.43H16.2602C16.5902 4.43 16.8602 4.7 16.8602 5.03C16.8602 5.36 16.5902 5.63 16.2602 5.63H13.8202C13.5802 5.63 13.3602 5.48 13.2702 5.26C13.1802 5.04 13.2302 4.78 13.4002 4.61L14.8102 3.2ZM20.1401 11.0101H21.1301C21.4601 11.0101 21.7401 11.2801 21.7401 11.6101C21.7401 11.9401 21.4701 12.2101 21.1401 12.2101H18.7001C18.4601 12.2101 18.2401 12.0601 18.1501 11.8401C18.0601 11.6201 18.1101 11.3601 18.2801 11.1901L19.6901 9.78008H18.7001C18.3701 9.78008 18.1001 9.51008 18.1001 9.18008C18.1001 8.85008 18.3701 8.58008 18.7001 8.58008H21.1301C21.3701 8.58008 21.5901 8.73008 21.6801 8.95008C21.7701 9.17008 21.7201 9.43008 21.5501 9.60008L20.1401 11.0101ZM11.0302 9.8499H12.8502L10.7002 11.9999C10.5302 12.1699 10.4802 12.4299 10.5702 12.6499C10.6602 12.8699 10.8802 13.0199 11.1202 13.0199H14.2902C14.6202 13.0199 14.8902 12.7499 14.8902 12.4199C14.8902 12.0899 14.6202 11.8199 14.2902 11.8199H12.5602L14.7102 9.6699C14.8802 9.4999 14.9302 9.2399 14.8402 9.0199C14.7502 8.7999 14.5302 8.6499 14.2902 8.6499H11.0202C10.6902 8.6499 10.4202 8.9199 10.4202 9.2499C10.4202 9.5799 10.7002 9.8499 11.0302 9.8499ZM14.5501 16.89C15.6601 16.89 16.7201 16.66 17.7101 16.19C17.9401 16.08 18.2101 16.13 18.3801 16.3C18.5601 16.48 18.6101 16.75 18.5001 16.98C17.0901 20.05 13.9901 22.03 10.6001 22.03C5.79013 22.03 1.88013 18.12 1.88013 13.31C1.88013 9.94004 3.87013 6.84004 6.93013 5.40004C7.16013 5.29004 7.43012 5.34004 7.61012 5.52004C7.79012 5.70004 7.84013 5.97004 7.73013 6.20004C7.27013 7.19004 7.03012 8.26004 7.03012 9.38004C7.03012 13.52 10.4001 16.89 14.5501 16.89ZM3.09013 13.31C3.09013 17.46 6.46012 20.83 10.6101 20.83C12.9901 20.83 15.2001 19.7 16.6001 17.85C15.9401 18.01 15.2501 18.09 14.5501 18.09C9.74013 18.09 5.83012 14.18 5.83012 9.38004C5.83012 8.68004 5.91013 7.99004 6.07013 7.32004C4.22013 8.73004 3.09013 10.94 3.09013 13.31Z"
        />
      </svg>
    </div>
  );
};
function getTheme(checked: boolean) {
  return checked ? 'dark' : 'light';
}

const ColorModeToggle = () => {
  // 'gatsby-plugin-dark-mode' 를 직접적으로 사용하지 않으나
  // 해당 모듈에서 front단에서 현재 환경을 체크하는 <script>를 삽입해주어서 이렇게 확인
  const { theme, themeToggler } = useDarkMode();

  const handleChange = (checked: boolean) => {
    const theme = getTheme(checked);

    themeToggler(theme);
  };

  return (
    <ToggleButton>
      <Switch
        onChange={handleChange}
        checked={theme === 'dark' ? true : false}
        id="normal-switch"
        height={26}
        width={54}
        handleDiameter={26}
        checkedIcon={<MoonIcon />}
        uncheckedIcon={<SunIcon />}
        offColor={'#d9dfe2'}
        offHandleColor={'#fff'}
        onColor={'#383A3F'}
        onHandleColor={'#3B71DA'}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      />
    </ToggleButton>
  );
};

export default ColorModeToggle;
