import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_TRACKING_ID;

export const initFacebookPixel = () => {
  ReactPixel.init(PIXEL_ID);
  ReactPixel.pageView(); // Optional: Track the initial page view
};
