import React, { createContext, useContext, ReactNode } from "react";

type LiveStreamMap = {
  [raceId: string]: string; // raceID -> YouTube video ID
};

// ✅ Example live streams
const initialStreams: LiveStreamMap = {
  monaco: "abc123XYZ",
  silverstone: "def456LMN",
  spa: "ghi789QRS",
};

const LiveContext = createContext<LiveStreamMap>(initialStreams);

export const LiveProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LiveContext.Provider value={initialStreams}>
      {children}
    </LiveContext.Provider>
  );
};

export const useLiveContext = () => useContext(LiveContext);
