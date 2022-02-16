import React from 'react';

export interface IKalilaLogoProps {
  color?: string;
}

export const KalilaLogo: React.FC<IKalilaLogoProps> = ({ color }) => {
  const defaultColor = '#003366';
  return (
    <svg height="100%" width="100%" x="0px" y="0px" viewBox="0 0 2100 720">
      <svg x="0" y="0">
        <g>
          <path
            transform="scale(1)"
            id="kalila-logo-dal"
            fill={color ?? defaultColor}
            d="M596.64,50.6c-22.21,18.82-33.3,43.05-33.3,72.67v467.94H80.76L6,716.69h610.67
		c14.64,0,27.19-5.22,37.64-15.67C664.77,690.55,670,678,670,663.36V3.54C645.37,19.23,620.91,34.91,596.64,50.6z"
          />
          <path
            transform="scale(1)"
            id="kalila-logo-kaf"
            fill={color ?? defaultColor}
            d="M504.44,469.15c0,14.99-4.79,27.63-14.38,37.9c-9.58,10.29-21.87,15.43-36.85,15.43H80.42V397h317.35V330.6
		c0-9.75-5.15-18.73-15.45-26.92c-10.31-8.19-20.51-12.29-30.64-12.29H140.54V129.31c8.03,13.95,19.92,26.32,35.62,37.12
		c17.12,11.85,33,17.78,47.68,17.78h173.93c31.22,0,56.8,9.93,76.75,29.8c19.93,19.87,29.91,44.1,29.91,72.67V469.15z"
          />
        </g>
        <text
          transform="matrix(1 0 0 1 750 550)"
          letterSpacing={20}
          fontSize={500}
          fontWeight={600}
          fontFamily={'Noto Sans Display'}
          fill={color ?? defaultColor}
        >
          Kalila
        </text>
      </svg>
    </svg>
  );
};
