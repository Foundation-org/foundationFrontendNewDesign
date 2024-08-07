const Iframe = () => {
  let iframeCode = `<iframe
      src="https://localhost:5173/embed/Gqabdqwz?darkMode=false&resultsMode=true"
      style="border: none; width: 100%; max-width: 600px;"
      onload="
        this.style.height = window.innerWidth < 600 ? '165px' : '326px';
        window.addEventListener('resize', () => {
          this.style.height = window.innerWidth < 600 ? '165px' : '326px';
        });
      "
      title="Embedded Content"
    ></iframe>`;

  return (
    <div className=" bg-red-100">
      <div dangerouslySetInnerHTML={{ __html: iframeCode }} />
    </div>
  );
};

export default Iframe;
