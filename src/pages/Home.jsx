import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { title } from "process";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const data = [
    {
      owner: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      title: "campaign 1",
      description: "test",
      target: "100",
      deadline: "2022-03-07T10:40:09.000Z",
      image:
        "https://i.ibb.co/GRzySZ2/Importance-of-Charity-in-Islam-2-scaled.jpg",
      pId: 0,
      amountCollected: 0,
    },
  ];

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={data}
    />
  );
};

export default Home;
