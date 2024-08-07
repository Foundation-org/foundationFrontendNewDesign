/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      black: '#000',
      white: '#FFF',
      'white-100': '#F0F0F0',
      'white-200': '#E9E9E9',
      'white-300': '#FEECEC',
      'white-400': '#DCDDDD',
      'white-500': '#DEE6F7',
      'white-600': '#F2F2F2',
      'white-700': '#F3F3F3',
      'white-800': '#F4F8FF',
      'white-900': '#FDFDFD',
      'accent-100': '#293138',
      'accent-200': '#9A9A9A',
      'accent-300': '#D6D6D6',
      'accent-400': '#85898C',
      'accent-500': '#9E9E9E',
      'accent-600': '#435059',
      'accent-700': '#5B5B5B',
      'accent-800': '#525252',
      'accent-900': '#647785',
      'blue-100': '#389CE3',
      'blue-200': '#4A8DBD',
      'blue-300': '#5FA3D5',
      'blue-400': '#1B3246',
      'blue-500': '#6BA5CF',
      'blue-600': '#7AC5F3',
      'blue-700': '#94d6ff',
      'gray-500': '#CECECE',
      'gray-100': '#77797B',
      'gray-150': '#707175',
      'gray-200': '#1B1F23',
      'gray-250': '#D9D9D9',
      'gray-300': '#F1F1F1',
      'gray-400': '#F2F3F5',
      'gray-500': '#282828',
      'gray-600': '#CECDCD',
      'gray-650': '#616161',
      'gray-700': '#ABABAB',
      'gray-800': '#ACACAC',
      'gray-900': '#7C7C7C',
      'silver-100': '#BDBDBD',
      'silver-200': '#313C47',
      'silver-300': '#1A1E22',
      'silver-400': '#283038',
      'silver-500': '#2E3237',
      'silver-600': '#202329',
      'red-100': '#FF2C2C',
      'red-200': '#DC1010',
      'red-300': '#280202',
      'red-400': '#FF4057',
      'red-500': '#FF1001',
      'green-100': '#4DD896',
      'green-200': '#0fb063',
      'gold-100': '#7A7016',
      'yellow-200': '#FFC300',
    },
    fontFamily: {
      poppins: ['Poppins'],
      neuropol: ['Neuropol'],
    },
    extend: {
      screens: {
        tablet: '600px',
        lgTablet: '1024px',
        laptop: '1280px',
        desktop: '1440px',
        '2xl': '1440px',
        '3xl': '1600px',
        '4xl': '1920px',
        '5xl': '2560px',
        // media queries for height
        short: { raw: '(max-height: 720px)' },
        tall: { raw: '(max-height: 768px)' },
        taller: { raw: '(max-height: 900px)' },
      },
      spacing: {
        8.6: '2.2rem',
        6.1: '1.7rem',
        5.3: '1.35rem',
      },
    },
  },
  plugins: [
    'prettier-plugin-tailwindcss',
    require('daisyui'),
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* Hide scrollbar for Webkit, Firefox, IE and Edge */
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
      });
    },
  ],
};
