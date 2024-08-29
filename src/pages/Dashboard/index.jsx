import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';
import DashboardLayout from './components/DashboardLayout';
import { useEffect } from 'react';

const Dashboard = () => {
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

    // Add script only when on the /
    if (location.pathname.startsWith('/')) {
      addGoogleAnalyticsScript();
    }

    // Cleanup function to remove the script if needed
    return () => {
      const scripts = document.querySelectorAll('script[src*="gtag"]');
      scripts.forEach((script) => script.remove());
    };
  }, [location.pathname]);

  // Add Meta Pixel script to the page head
  useEffect(() => {
    // Function to insert the script tag for Meta Pixel
    const insertMetaPixelScript = () => {
      // Check if the script is already added to avoid duplicate scripts
      if (document.getElementById('meta-pixel-script')) return;

      const script = document.createElement('script');
      script.id = 'meta-pixel-script';
      script.async = true;
      script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1534508323834469');
          fbq('track', 'PageView');
        `;
      document.head.appendChild(script);

      // Add the noscript fallback for users with JavaScript disabled
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=1534508323834469&ev=PageView&noscript=1" />
        `;
      document.body.appendChild(noscript);
    };

    insertMetaPixelScript();

    // Cleanup to remove the script when the component unmounts
    return () => {
      const script = document.getElementById('meta-pixel-script');
      if (script) document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100dvh-48px)] justify-between bg-gray-400 tablet:h-[calc(100dvh-96px)] laptop:h-[calc(100dvh-70px)] dark:bg-black">
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </div>
    </>
  );
};

export default Dashboard;
