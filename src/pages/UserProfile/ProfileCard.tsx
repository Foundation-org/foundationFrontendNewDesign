import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/Button';

export default function ProfileCard() {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const profile = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain;

  return (
    <div className="relative mx-auto flex w-full max-w-[730px] flex-col items-center gap-[14px] rounded-[13.84px] border-[1.846px] border-[#D9D9D9] bg-white p-[18px] tablet:gap-4 tablet:p-5">
      <div className="flex w-full items-center gap-[14px] tablet:gap-6">
        <div>
          <div className="relative flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-[5px] border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px]">
            <div className="absolute bottom-0 flex h-[40%] w-full items-center justify-center bg-[#FBFBFB]/50">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/camera.svg`}
                alt="save icon"
                className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[45px]"
              />
            </div>
            <img
              src={profile?.s3Urls[0]}
              alt="aa"
              className="size-[50px] rounded-full object-cover tablet:size-[175px]"
            />
          </div>
          <div>
            <p className="whitespace-nowrap text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[16px]">
              Profile Viewers
            </p>
            <p className="text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[16px]">
              {profile?.viewers}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[#7C7C7C] tablet:gap-4">
          <div>
            <h1 className="text-[12px] font-semibold tablet:text-[20px]"> {profile?.title}</h1>
            <p className="text-[10px] leading-normal tablet:text-[16px]"> {profile?.name}</p>
          </div>
          <p className="text-[11px] leading-normal tablet:text-[18px]">{profile?.description}</p>
        </div>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/editIcon.svg`}
          alt="Edit Icon"
          className="absolute right-4 top-4 h-[12px] w-[12px] cursor-pointer tablet:h-[23px] tablet:w-[23px]"
          // onClick={() => {
          //   setFetchingEdit(true), setAddAnotherForm(true), setEdit(true), handleEdit(item.id);
          // }}
        />
      </div>
      <div className="flex w-full items-center justify-end">
        <Button variant="submit">View as public</Button>
      </div>
    </div>
  );
}
