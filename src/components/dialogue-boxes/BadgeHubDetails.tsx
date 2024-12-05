import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';

type ClearAllAnalyticsProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  selectedBadge: string;
  badges: any;
};

export default function BadgeHubDetails(props: ClearAllAnalyticsProps) {
  const { handleClose, modalVisible, title, image, selectedBadge, badges } = props;

  const selectedBadgeDetails = badges && badges?.find((badge: any) => badge.type === selectedBadge && badge.isAdded);

  const renderBadgeDetails = () => {
    switch (selectedBadgeDetails.type) {
      case 'etherium-wallet':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Ethereum wallet
            </h1>
            <p className="summary-text">{selectedBadgeDetails.web3['etherium-wallet']}</p>
          </div>
        );

      case 'dateOfBirth':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Age
            </h1>
            <p className="summary-text">{selectedBadgeDetails.personal?.dateOfBirth}</p>
          </div>
        );

      case 'currentCity':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Current City
            </h1>
            <p className="summary-text">{selectedBadgeDetails.personal.currentCity}</p>
          </div>
        );

      case 'homeTown':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Home Town
            </h1>
            <p className="summary-text">{selectedBadgeDetails.personal.homeTown}</p>
          </div>
        );

      case 'sex':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Sex
            </h1>
            <p className="summary-text">{selectedBadgeDetails.personal.sex}</p>
          </div>
        );

      case 'relationshipStatus':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Relationship Status
            </h1>
            <p className="summary-text">{selectedBadgeDetails.personal.relationshipStatus}</p>
          </div>
        );

      case 'workPersonal':
        return (
          <div className="space-y-2">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Work
            </h1>
            {selectedBadgeDetails.personal.work.map((item: any) => (
              <div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Company Name
                  </h1>
                  <p className="summary-text">{item.companyName}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Job Title
                  </h1>
                  <p className="summary-text">{item.jobTitle}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Mode of Job
                  </h1>
                  <p className="summary-text">{item.modeOfJob}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Starting Year
                  </h1>
                  <p className="summary-text">{item.startingYear}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Ending Year
                  </h1>
                  <p className="summary-text">{item.endingYear}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'educationPersonal':
        return (
          <div className="space-y-2">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Education
            </h1>
            {selectedBadgeDetails.personal.education.map((item: any) => (
              <div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Country
                  </h1>
                  <p className="summary-text">{item.country}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Degree Program
                  </h1>
                  <p className="summary-text">{item.degreeProgram}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Field of study
                  </h1>
                  <p className="summary-text">{item.fieldOfStudy}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Graduation Year
                  </h1>
                  <p className="summary-text">{item.graduationYear}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    School
                  </h1>
                  <p className="summary-text">{item.school}</p>
                </div>
                <div className="item-center flex justify-between">
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    Starting year
                  </h1>
                  <p className="summary-text">{item.startingYear}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'geolocation':
        return (
          <div className="item-center flex justify-between">
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Last Location
            </h1>
            <p className="summary-text">{selectedBadgeDetails.personal?.geolocation}</p>
          </div>
        );

      case 'security-question':
        const securityQuestions = selectedBadgeDetails.personal?.['security-question'] as
          | Record<string, string>
          | undefined;

        return (
          <div>
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Security Question
            </h1>
            {securityQuestions ? (
              Object.entries(securityQuestions).map(([question, answer]) => (
                <div className="item-center flex justify-between" key={question}>
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    {question}
                  </h1>
                  <p className="summary-text">{answer}</p>
                </div>
              ))
            ) : (
              <div>No security questions found.</div>
            )}
          </div>
        );

      case 'linkHub':
        return (
          <div>
            <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              LinkHub
            </h1>
            {selectedBadgeDetails.personal?.linkHub?.length ? (
              selectedBadgeDetails.personal.linkHub.map((linkItem: any) => (
                <div className="item-center flex justify-between" key={linkItem.id}>
                  <h1 className="text-[12px] font-semibold capitalize leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
                    {linkItem.title}
                  </h1>
                  <a
                    className="summary-text text-blue-100 underline"
                    href={`https://${linkItem.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkItem.link}
                  </a>
                </div>
              ))
            ) : (
              <div>No links available.</div>
            )}
          </div>
        );

      default:
        return <div>Unknown Badge Type</div>;
    }
  };

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      autoSize={false}
      closeIcon={null}
      customClasses={''}
      customStyle={''}
      remove={false}
      isBackground={false}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        {!selectedBadgeDetails ? (
          <div>No badge found for the selected ID.</div>
        ) : (
          <h1 className="text-gray-150 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
            {renderBadgeDetails()}
          </h1>
        )}
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'cancel'} onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
