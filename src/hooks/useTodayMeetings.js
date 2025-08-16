import { useEffect, useState } from "react";

export const useTodayMeetings = (userMeetings) => {
  const [todayMeetings, setTodayMeetings] = useState([]);

  useEffect(() => {
    if (!userMeetings) return;
    const today = new Date().toDateString();
    console.log(today);
    const finding = userMeetings
      .filter((meeting) => new Date(meeting.startTime).toDateString() === today)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    setTodayMeetings(finding);
  }, [userMeetings]);

  return { todayMeetings };
};
