import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const successToaster = (message: string) => {
  return toast.success(message, {
    position: "top-right",
  });
};

export const errorToaster = (message: string) => {
  return toast.error(message, {
    position: "top-right",
  });
};
