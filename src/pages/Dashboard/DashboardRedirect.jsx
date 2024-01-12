import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { userInfo } from "../../api/userAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/auth/authSlice";

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
    onSuccess: (res) => {
      dispatch(addUser(res.data));
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error fetching user info:", error);
    },
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  return <div>DashboardRedirect</div>;
};

export default DashboardRedirect;
