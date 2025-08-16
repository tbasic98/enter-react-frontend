import { useEffect, useState } from "react";
import { useTimer } from "./useTimer";

export const useCurrentMeetings = (userMeetings) => {
  const [currentMeeting, setCurrentMeeting] = useState({});

  const { currentTime } = useTimer();

  useEffect(() => {
    const now = currentTime;
    const finding = userMeetings.find((meeting) => {
      const start = new Date(meeting.startTime);
      const end = new Date(meeting.endTime);
      return now >= start && now <= end;
    });

    setCurrentMeeting(finding);
  }, [currentTime]);

  return { currentMeeting };
};
