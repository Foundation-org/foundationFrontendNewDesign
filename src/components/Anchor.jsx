import React from "react";

const Anchor = ({ href, className, children, type }) => {
  let classes = `text-light-blue text-[16px] font-normal leading-[22px] ${className}`;
  return (
    <a href={href} className={classes} type={type}>
      {children}
    </a>
  );
};

export default Anchor;
