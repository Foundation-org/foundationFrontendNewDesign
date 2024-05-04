import { Link } from 'react-router-dom';

const Anchor = ({ href, className, children, type }) => {
  let classes = `short:text-[12px] text-light-blue text-[8.158px] leading-[8.158px] md:text-[16px] font-normal tablet:leading-[22px] ${className}`;
  return (
    <Link to={href} className={classes} type={type}>
      {children}
    </Link>
  );
};

export default Anchor;
