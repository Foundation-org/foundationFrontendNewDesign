import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef, useEffect } from 'react';
import HelpSlider from './components/HelpSlider';
import Breadcrumb from '../../../../components/Breadcrumb';

const CustomerSupport = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Function to add the Google Analytics script
    const addGoogleAnalyticsScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16685473482';
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-16685473482');
      `;
      document.head.appendChild(inlineScript);
    };

    // Add script only when on the /help/ route
    if (location.pathname.startsWith('/help')) {
      addGoogleAnalyticsScript();
    }

    // Cleanup function to remove the script if needed
    return () => {
      const scripts = document.querySelectorAll('script[src*="gtag"]');
      scripts.forEach((script) => script.remove());
    };
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-[#F2F3F5] tablet:h-[calc(100vh-70px)] laptop:mx-[331px] desktop:mx-auto dark:bg-black">
      <Breadcrumb />
      <div className="fixed left-1/2 flex w-full max-w-full -translate-x-1/2 justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <HelpSlider />
      </div>
      <div
        ref={scrollRef}
        className={`mx-auto mt-10 h-[calc(100dvh-174px)] max-w-[778px] overflow-y-scroll no-scrollbar tablet:mt-[77.63px] tablet:h-[calc(100dvh-224px)] tablet:px-6 tablet:pb-5 laptop:h-[calc(100dvh-147.6px)] ${location.pathname === '/help/contact-us' && 'px-3 tablet:px-0'}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerSupport;
