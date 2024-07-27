import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { db } from "../utils/dbConfig";
import { Users } from "../utils/schema";
import { eq } from "drizzle-orm";

import { CustomButton } from ".";
import { logo, menu, search } from "../assets";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { ready, authenticated, login, user, logout } = usePrivy();

  console.log(ready, authenticated, user);

  const checkAndCreateUser = useCallback(async () => {
    try {
      const existingUser = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, user.email.address))
        .execute();

      if (existingUser.length === 0) {
        await db
          .insert(Users)
          .values({
            folders: [], // Initialize with empty array
            treatmentCounts: 0, // Initialize with 0
            folder: [], // Initialize with empty array
            createdBy: user.email.address,
          })
          .execute();
      }
    } catch (error) {
      console.error("Error checking or creating user:", error);
    }
  }, [user]);

  useEffect(() => {
    if (authenticated && user) {
      checkAndCreateUser();
    }
  }, [authenticated, user, checkAndCreateUser]);

  const handleLoginLogout = useCallback(() => {
    if (authenticated) {
      logout();
    } else {
      login().then(() => {
        if (user) {
          checkAndCreateUser();
        }
      });
    }
  }, [authenticated, login, logout, user, checkAndCreateUser]);

  return (
    <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row">
      <div className="flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-[#1c1c24] py-2 pl-4 pr-2 lg:flex-1">
        <input
          type="text"
          placeholder="Search for records"
          className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-[#4b5264]"
        />

        <div className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#4acd8d]">
          <img
            src={search}
            alt="search"
            className="h-[15px] w-[15px] object-contain"
          />
        </div>
      </div>

      <div className="hidden flex-row justify-end gap-2 sm:flex">
        <CustomButton
          btnType="button"
          title={authenticated ? "Log Out" : "Log In"}
          styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={handleLoginLogout}
        />
      </div>

      {/* Small screen navigation */}
      <div className="relative flex items-center justify-between sm:hidden">
        <div className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] bg-[#2c2f32]">
          <img
            src={logo}
            alt="user"
            className="h-[60%] w-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="h-[34px] w-[34px] cursor-pointer object-contain"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute left-0 right-0 top-[60px] z-10 bg-[#1c1c24] py-4 shadow-secondary ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`h-[24px] w-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue text-[14px] font-semibold ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="mx-4 flex"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
