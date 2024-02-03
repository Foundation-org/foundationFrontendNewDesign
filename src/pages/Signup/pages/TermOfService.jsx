import TermsPrivacyLayout from '../components/TermsPrivacyLayout';

const TermOfService = () => {
  return (
    <TermsPrivacyLayout>
      <h1 className="text-[30px] font-semibold text-center">Terms Of Service</h1>
      <p className="text-[19.36px] font-normal text-center">Last Updated: January 19, 2024</p>
      <div>
        <h4 className="text-[22px] font-semibold">Agreement to Our Legal Terms</h4>
        <p className="text-[20px] font-normal">
          Foundation Internet Organization, Inc., a Delaware-registered company located at 651 N. Broad Street Suite
          201, Middletown, DE 19709, United States, operates the website on.foundation and other related services.
          Contact us at 7409738056, justin@foundation-io.com, or by mail at our address
        </p>
        <p className="text-[20px] font-normal">
          Your access and use of our services indicate your agreement to these Terms. If you do not agree, discontinue
          use immediately. We will notify you of any significant changes to the services or these Terms. Continued use
          after changes indicates your acceptance of the new terms.
        </p>
        <p className="text-[20px] font-normal">
          The Services are intended for users aged 16 and above. We are not attorneys, nor do we specialize in law.
          Foundation Internet Organization is simply trying to create something special so by agreeing to these terms,
          you agree not to sue us unless we do something really bad on purpose.
        </p>
      </div>
      <div>
        <div>Sidebar</div>
        <div></div>
      </div>
    </TermsPrivacyLayout>
  );
};

export default TermOfService;
