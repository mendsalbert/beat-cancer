import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  records,
  screening,
  withdraw,
  logo1,
  user,
  apps,
} from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: apps,
    link: "/",
  },
  {
    name: "records",
    imgUrl: records,
    link: "/medical-records",
  },
  {
    name: "screening",
    imgUrl: screening,
    link: "/screening-schedules",
  },

  {
    name: "profile",
    imgUrl: user,
    link: "/profile",
  },
];
