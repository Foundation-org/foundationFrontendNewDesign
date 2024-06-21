import { useSelector } from 'react-redux';
import { privacyPolicyData, summaryPoints } from '../../../../features/term-privacy/privacy-policy';

const About = () => {
    const persistedUserInfo = useSelector((state) => state.auth.user);

    return (
        <div className="bg-white mb-12 pb-5">
            <h1 className="py-3 text-center text-[0.875rem] font-bold leading-[0.875rem] text-[#707175] pb-1 tablet:pb-[10px] tablet:pt-5 tablet:text-[1.25rem] tablet:leading-[1.25rem]">Privacy Policy</h1>
            <p className="text-center text-[0.6875rem] font-normal leading-[0.6875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">Last Updated: January 19, 2024</p>
            <div className="term_policy_paragraph mt-[5px] tablet:mt-[15px] space-y-[0.2rem] px-8 text-[#707175] tablet:space-y-2 tablet:px-16">
                <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    This Privacy Notice for Foundation Internet Organization, Inc. ("we," "us," or "our") outlines how and why we
                    might collect, store, use, and/or share ("process") your information when you use our services ("Services").
                    This includes interactions such as:
                </p>
                <ul className="list-disc pl-4 tablet:pl-6 text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    <li>
                        Visiting our website at https://on.foundation, or any of our websites that link to this notice.
                    </li>
                    <li>
                        Engaging with us in other related ways, including sales, marketing, or events.
                    </li>
                </ul>
                <h4 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">Have Questions or Concerns?</h4>
                <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    Please read this notice to understand your privacy rights and choices. If you disagree with our policies and
                    practices, refrain from using our Services. For questions or concerns, reach out to us at
                    info@foundation-io.com.
                </p>
                <h4 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">SUMMARY OF KEY POINTS</h4>
                <ul className="list-disc pl-4 tablet:pl-6 text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    {summaryPoints.map((item, index) => (
                        <li key={index + 1}>{item}</li>
                    ))}
                </ul>
                <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">For more details, review the full privacy notice.</p>
                <ul className="list-decimal pl-4 tablet:pl-6 mt-3 tablet:mt-6 text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    {privacyPolicyData.map((item, index) => (
                        <li key={index}>
                            <h4 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">{item.point}</h4>
                            {item.sections ? (
                                item.sections.map((section, secIndex) => (
                                    <div key={secIndex}>
                                        <h3 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">{section.title}</h3>
                                        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">{section.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">{item.content}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default About;
