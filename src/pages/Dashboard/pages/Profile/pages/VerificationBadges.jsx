import Button from '../components/Button';

const VerificationBadges = () => {
  const items = [
    {
      image: '/assets/svgs/dashboard/mail1.svg',
      title: 'Personal Email',
      addButtonColor: 'gray',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/mail1.svg',
      title: 'Work Email',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/mail1.svg',
      title: 'Education Email',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/mail2.svg',
      title: 'Personal Email',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/mail2.svg',
      title: 'Work Gmail',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/mail2.svg',
      title: 'Education Gmail',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/eth.svg',
      title: 'Etherium Wallet',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/linkedin.svg',
      title: 'LinkedIn',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/github.svg',
      title: 'Github',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/fb.svg',
      title: 'Facebook',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/Twitter.svg',
      title: 'Twitter',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/insta.svg',
      title: 'Instagram',
      addButtonColor: 'gray',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/geo.svg',
      title: 'Geolocation',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/phone.svg',
      title: 'Personal Phone',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/workphone.svg',
      title: 'Work Phone',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/webAuth.svg',
      title: 'WebAuth Desktop',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/webAuth.svg',
      title: 'WebAuth Mobile',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/identity.svg',
      title: 'Identity',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
    {
      image: '/assets/svgs/dashboard/multiAuth.svg',
      title: 'Multi-Factor Authentication',
      addButtonColor: 'blue',
      removeButtonColor: 'red',
    },
  ];

  return (
    <div>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[56px] ml-[156px]">
        My Verification Badges
      </h1>
      <div className="mx-[106px] rounded-[45px] shadow-inside pt-[104px] pb-[66.8px] px-[60px] flex flex-col gap-[23px] my-[54px] relative">
        <div className="flex justify-center gap-[21px] absolute -top-1 left-[50%] transform -translate-x-[50%] w-[95%] mx-auto">
          <div className="bg-[#4A8DBD] h-[11.1px] w-full rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-full rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-full rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-full rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-full rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-full rounded-[100px]" />
        </div>
        {items.map((item, index) => (
          <div className="flex" key={index}>
            <img src={item.image} alt={item.title} />
            <div className="mx-[30px] rounded-[18.335px] shadow-inside w-full flex items-center">
              <h1 className="text-[#000] text-[24px] font-medium leading-normal pl-[50px]">
                {item.title}
              </h1>
            </div>
            <Button color={item.addButtonColor}>Add</Button>
            <Button color={item.removeButtonColor}>Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationBadges;
