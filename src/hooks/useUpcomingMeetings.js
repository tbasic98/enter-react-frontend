import { useEffect, useState } from "react";

export const useUpcomingMeetings = (userMeetings) => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  useEffect(() => {
    const now = new Date();

    const finding = userMeetings
      .filter((meeting) => {
        const meetingStart = new Date(meeting.startTime);
        const minutesFromNow = (meetingStart - now) / (1000 * 60);

        console.log(minutesFromNow);

        // Meetingi koji počinju za više od 30 minuta
        return minutesFromNow < 30 && minutesFromNow > 0;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    setUpcomingMeetings(finding);
  }, [userMeetings]);

  return { upcomingMeetings };
};
