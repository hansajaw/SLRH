import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import api from "../utils/api";

type LiveStreamMap = {
  [raceId: string]: string; // raceID -> YouTube video ID
};

const LiveContext = createContext<LiveStreamMap>({});

export const LiveProvider = ({ children }: { children: ReactNode }) => {
  const [liveStreams, setLiveStreams] = useState<LiveStreamMap>({});

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        // Assuming backend has a way to identify live streams, e.g., category: "live"
        const { data } = await api.get("/media", { params: { category: "live" } });
        const streams: LiveStreamMap = {};
        data.items.forEach((item: any) => {
          // Assuming item.description contains the YouTube video ID and item._id is the raceId
          if (item.description) {
            streams[item._id] = item.description;
          }
        });
        setLiveStreams(streams);
      } catch (error) {
        console.error("Error fetching live streams:", error);
      }
    };

    fetchLiveStreams();
  }, []);

  return (
    <LiveContext.Provider value={liveStreams}>
      {children}
    </LiveContext.Provider>
  );
};

export const useLiveContext = () => useContext(LiveContext);
