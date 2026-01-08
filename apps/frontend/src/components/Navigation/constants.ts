import Clock from "@icons/clock.svg?react";
import Compose from "@icons/compose.svg?react";
import Gear from "@icons/gear.svg?react";
import Home from "@icons/home.svg?react";
import Signpost from "@icons/signpost.svg?react";

export const navigationItems = [
  {
    location: "/home",
    Icon: Home,
    label: "Home",
  },
  {
    location: "/discover",
    Icon: Signpost,
    label: "Discover",
  },
  {
    location: "/report",
    Icon: Compose,
    label: "Report",
    customIconClasses: "ml-[6px]",
  },
  {
    location: "/history",
    Icon: Clock,
    label: "History",
  },
  {
    location: "/settings",
    Icon: Gear,
    label: "Settings",
  },
];
