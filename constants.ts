import React from 'react';
import type { Category } from './types';

// --- SVG ICONS ---
const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props },
    React.createElement('path', { fillRule: "evenodd", d: "M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S15.885 2.25 10.5 2.25a.75.75 0 00-1.071-.038A9.75 9.75 0 0112.963 2.286z", clipRule: "evenodd" }),
    React.createElement('path', { d: "M10.719 1.234a.75.75 0 00-1.113.864 9.78 9.78 0 00-.57 2.379 7.493 7.493 0 01-4.032 4.032A9.78 9.78 0 004.234 9.08a.75.75 0 00-.864 1.113 9.75 9.75 0 0012.87 12.87.75.75 0 001.113-.864 9.78 9.78 0 00.57-2.379 7.493 7.493 0 014.032-4.032A9.78 9.78 0 0019.766 9.08a.75.75 0 00.864-1.113A9.75 9.75 0 0010.719 1.234z" })
  )
);

const FloodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props },
    React.createElement('path', { d: "M12.378 1.602a.75.75 0 00-.756 0L3 7.252v1.037a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V7.252L12.378 1.602zM21 10.5H3v8.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V10.5z" }),
    React.createElement('path', { d: "M15.47 13.91a.75.75 0 01.998.118 10.59 10.59 0 011.696 3.016.75.75 0 11-1.41.527 9.09 9.09 0 00-1.45-2.586.75.75 0 01.166-1.075zM10.63 13.91a.75.75 0 00-.166 1.075 9.09 9.09 0 001.45 2.586.75.75 0 101.41-.527 10.59 10.59 0 00-1.696-3.016.75.75 0 00-.998-.118zM5.834 13.75a.75.75 0 01.834.666 9.09 9.09 0 01.27 3.834.75.75 0 11-1.498.07 10.59 10.59 0 00-.316-4.433.75.75 0 01.71-.837z" })
  )
);

const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props },
    React.createElement('path', { fillRule: "evenodd", d: "M3.75 12a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75c0 .414.336.75.75.75h7.5a.75.75 0 01.75-.75v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v5.25a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75a.75.75 0 00-.75-.75h-7.5a.75.75 0 00-.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V12zm11.25-5.25a.75.75 0 00-.75-.75h-7.5a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h7.5c.414 0 .75-.336.75-.75v-.75z", clipRule: "evenodd" }),
    React.createElement('path', { d: "M2.25 12c0-3.313 2.686-6 6-6h7.5c3.313 0 6 2.687 6 6v5.25c0 3.313-2.687 6-6 6H8.25c-3.314 0-6-2.687-6-6V12zM8.25 4.5a.75.75 0 01.75.75v.75a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-.75a.75.75 0 011.5 0v.75a3.75 3.75 0 01-3.75 3.75h-1.5A3.75 3.75 0 016.75 6v-.75a.75.75 0 01.75-.75H8.25z" })
  )
);

const PeopleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props },
    React.createElement('path', { d: "M12 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM10.5 16.5a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75a1.5 1.5 0 00-1.5-1.5h-1.5z" }),
    React.createElement('path', { fillRule: "evenodd", d: "M4.5 9.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM5.25 15a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5H5.25z", clipRule: "evenodd" }),
    React.createElement('path', { d: "M8.25 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM6.75 16.5a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75a1.5 1.5 0 00-1.5-1.5h-1.5zM15.75 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM14.25 16.5a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75a1.5 1.5 0 00-1.5-1.5h-1.5z" })
  )
);


export const SCENARIO_CATEGORIES: Category[] = [
  {
    key: "urbanFire",
    icon: FireIcon,
  },
  {
    key: "floodResponse",
    icon: FloodIcon,
  },
  {
    key: "roadAccident",
    icon: CarIcon,
  },
  {
    key: "marketplaceStampede",
    icon: PeopleIcon,
  },
];
