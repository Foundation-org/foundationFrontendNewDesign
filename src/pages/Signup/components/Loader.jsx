const Loader = () => {
  return (
    <div className="w-screen h-screen absolute top-0 bottom-0 bg-gray-100 z-50 bg-opacity-75 overflow-hidden text-center flex items-center justify-center">
      <span className="text-black loading loading-ring loading-lg"></span>
    </div>
  );
};

export default Loader;
