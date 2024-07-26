import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import { Home, Profile } from "./pages";
import MedicalRecords from "./pages/records/index";
import ScreeningSchedule from "./pages/ScreeningSchedule";
import SingleRecordDetails from "./pages/records/single-record-details";
import { usePrivy } from "@privy-io/react-auth";

const App = () => {
  const { ready, authenticated, login, user, logout } = usePrivy();
  const navigate = useNavigate();
  // console.log(authenticated, user);
  // useEffect(() => {
  //   if (!authenticated) {
  //     login();
  //   }
  // }, [authenticated, login]);

  // if (!ready) {
  //   return <div>Loading...</div>;
  // }

  // if (!authenticated) {
  //   return <div className="bg-[#13131a]"></div>;
  // }

  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route
            path="/medical-records/:id"
            element={<SingleRecordDetails />}
          />
          <Route path="/screening-schedules" element={<ScreeningSchedule />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
