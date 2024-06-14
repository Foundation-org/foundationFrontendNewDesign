import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {

    const location = useLocation()

    useEffect(() => {
        const firstContainer = document.getElementById('scrollToTop');

        if (firstContainer) {
            firstContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.pathname]);
};

export default useScrollToTop;