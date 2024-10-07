import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useTricera = () => {
  const [configs, setConfigs] = useState([]);
  
  useEffect(() => {
    if (!localStorage.getItem("photoapp-uuid")) {
      localStorage.setItem("photoapp-uuid", uuidv4());
    }
    // if(!sessionStorage.getItem("photoapp-configs")){
    //   localStorage.removeItem("photoapp-uuid");
    // }
  }); 
  
  useEffect(() => {
    if (sessionStorage.getItem("photoapp-configs")) {
      setConfigs(JSON.parse(sessionStorage.getItem("photoapp-configs")))
     }
     
  },[]); 

  const setConfigSession=(config)=>{
    setConfigs(config)
  
    sessionStorage.setItem("photoapp-configs", JSON.stringify(config));
  }

  const getUUID = () => {
    const uuid = localStorage.getItem("photoapp-uuid");
    if (uuid) {
      return uuid;
    } else {
      const uuid = uuidv4();
      localStorage.setItem("photoapp-uuid", uuid);
      return uuid;
    }
  };
  return {
    getUUID,
    setConfigs,
    configs,
    setConfigSession
  };
};
export default useTricera;
