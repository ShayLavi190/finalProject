import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    id: "",
    phone: "",
    street: "",
    number:"",
    city: "",
    country:"",
    selectedBank:"",
    bankAccountNumber:"",
    bankBranchNumber:"",
    selectedHealthFund:"",
    healthFundAccountNumber:"",
    emergencyNumber:"",
    permissions:{
      publicServices:false,
      emergencyContacts:false,
      shareHealthInfo:false,
      healthMonitoring:false,
      cameraAccess:false,
      robotTracking:false,
      voiceRecognition:false,
      customization:false,
      maintenance:false,
      socialInteraction:false,
      financialActions:false,
      automatedTasks:false,
      smartHomeControl:false,
      familyUpdates:false
    }

  });

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
