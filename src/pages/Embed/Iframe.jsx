const Iframe = () => {
  return (
    <>
      <iframe
        src="https://localhost:5173/embed/66ab5d259c3e5020ecfc9c94" // Use a publicly accessible URL for testing
        style={{ width: '100%', height: '600px', border: 'none' }}
        title="Embedded Content"
      ></iframe>
    </>
  );
};

export default Iframe;
