import PopUp from '../ui/PopUp';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { deleteListSettings } from '../../services/api/listsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../ui/Toast';

export default function DeleteListSettingsPopup({ handleClose, modalVisible, title, image, categoryId }) {
    const queryClient = useQueryClient();

    const { mutateAsync: handleDeleteList, isPending } = useMutation({
        mutationFn: deleteListSettings,
        onSuccess: (resp) => {
            console.log('resp', resp);
            console.log('List Settings deleted Successfully');

            // if (resp.response.status === 500) {
            //   toast.warning('Something goes wrong.');
            //   return;
            // }

            showToast('success', 'deleteList');
            // queryClient.setQueriesData(['lists'], (oldData) => {
            //   console.log('old', oldData);
            //   return oldData?.map((page) => page.filter((item) => item._id !== categoryId));
            // });

            queryClient.invalidateQueries(['lists']);

            handleClose();
        },
        onError: (error) => {
            console.log(error);
            // toast.warning(error.response.data.message);
        },
    });

    return (
        <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
            <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
                <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
                    Are you sure you want to delete share settings of this list?
                </h1>
                <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
                    <Button
                        variant={'submit'}
                        onClick={() => {
                            handleDeleteList(categoryId);
                        }}
                    >
                        {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
                    </Button>
                    <Button variant={'cancel'} onClick={handleClose}>
                        No
                    </Button>
                </div>
            </div>
        </PopUp>
    );
}
