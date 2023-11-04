import { useState } from 'react';
import Input from '../../../components/Input';
import PasswordStrengthBar from 'react-password-strength-bar';

const Form = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPassChange = (e) => {
    setPassword(e.target.value);
  };

  const onReTypePassChange = (e) => {
    setReTypePassword(e.target.value);
  };

  return (
    <form className="w-full flex flex-col gap-11 my-6 dark:text-white text-gray-600">
      <Input
        type="email"
        id="email"
        label="Email Address"
        className="border-b py-1 focus:outline-none dark:focus:border-white focus:border-[#C0C0C0] focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-[#C0C0C0] dark:border-white"
        autoComplete="off"
        onChange={onEmailChange}
      />
      <div>
        <div className="relative">
          <Input
            type="password"
            id="password"
            label="Password"
            className="border-b py-1 focus:outline-none dark:focus:border-white focus:border-[#C0C0C0] focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-white"
            autoComplete="off"
            onChange={onPassChange}
          />
          <img
            src="/assets/svgs/blind.svg"
            alt="blind"
            className="absolute right-2 -top-2"
          />
        </div>
        <div className="-mt-1">
          <PasswordStrengthBar password={password} />
        </div>
      </div>
      <div>
        <div className="relative">
          <Input
            type="password"
            id="retype-password"
            label="Re-Type Password"
            className="border-b py-1 focus:outline-none focus:border-white focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-white"
            autoComplete="off"
            onChange={onReTypePassChange}
          />
          <img
            src="/assets/svgs/blind.svg"
            alt="blind"
            className="absolute right-2 -top-2"
          />
        </div>
        <div className="-mt-1">
          <PasswordStrengthBar password={reTypePassword} />
        </div>
      </div>
    </form>
  );
};

export default Form;
