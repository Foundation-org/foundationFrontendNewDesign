import { useEffect } from 'react';

export default function FallBack({ error }) {
  //   useEffect(() => {
  //     const timerId = setTimeout(() => {
  //       window.location.reload(); // Reload the page after 5 seconds
  //     }, 5000); // 5000 milliseconds = 5 seconds

  //     return () => clearTimeout(timerId); // Clean up the timer on component unmount
  //   }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-2xl font-bold">
      <div className="flex items-center">
        <p>Something went wrong:</p>
        <pre style={{ color: 'red' }}> {error && error.toString()}</pre>
      </div>
      {/* <p>Reloading the site in 5sec...</p> */}
    </div>
  );
}
