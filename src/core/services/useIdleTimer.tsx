import { useEffect, useRef } from "react";
import { useBusinessStore } from "./stores/useBusinessStore";
import toast from "react-hot-toast";

interface Props {
  timeout: number;
  onInactive: () => void;
}

const useIdleTimer = ({ timeout, onInactive }: Props): any => {
  const token = useBusinessStore((store) => store.authData.token);
  const lastActiveTime = useRef<number>(Date.now());

  useEffect(() => {
    const handleUserInteraction = () => {
      lastActiveTime.current = Date.now();
    };

    const events = ["click", "mousemove", "keydown"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserInteraction)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserInteraction)
      );
    };
  }, []);

  useEffect(() => {
    const handleInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActiveTime.current;

      if (timeSinceLastActivity >= timeout && token) {
        onInactive();
        toast.error("You have been logged out due to inactivity");
      }
    };

    const intervalId = setInterval(handleInactivity, timeout);

    return () => clearInterval(intervalId);
  }, [timeout, onInactive, token]);

  return null;
};

export default useIdleTimer;
