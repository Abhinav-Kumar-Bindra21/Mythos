import React, { useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate } = useAppContext();

  const [search, setSearch] = useState("");

  return (
    <div
      className={`
        flex flex-col
        h-screen
        min-w-72
        p-5

        border-r
        border-gray-300
        dark:border-[#80609F]/30

        dark:bg-gradient-to-b
        dark:from-[#242124]/30
        dark:to-[#000000]/30

        backdrop-blur-3xl

        max-md:absolute
        max-md:left-0
        max-md:top-0
        max-md:z-50

        transform
        transition-transform
        duration-300

        ${isMenuOpen ? "translate-x-0" : "max-md:-translate-x-full"}
      `}
    >
      {/* Logo */}
      <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} className="w-full max-w-48" alt="Logo" />

      {/* New Chat */}
      <button className="w-full py-2 mt-10 flex items-center justify-center rounded-md text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] cursor-pointer">
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />

        <input
          type="text"
          placeholder="Search conversations"
          className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

      <div className="flex-1 overflow-y-auto mt-3 space-y-3 text-sm">
        {chats
          .filter((chat) => {
            const query = search.toLowerCase();

            if (chat.messages[0]) {
              return chat.messages[0].content.toLowerCase().includes(query);
            }

            return chat.name.toLowerCase().includes(query);
          })

          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="p-2 px-4 rounded-md border border-gray-300 dark:border-[#80609F]/15 cursor-pointer flex justify-between items-center group dark:bg-[#57317C]/10"
            >
              <div className="overflow-hidden">
                <p className="truncate max-w-[180px]">
                  {chat.messages.length ? chat.messages[0].content.slice(0, 32) : chat.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">{moment(chat.updatedAt).fromNow()}</p>
              </div>

              <img
                src={assets.bin_icon}
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                alt=""
              />
            </div>
          ))}
      </div>

      {/* Community Images */}
      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition"
      >
        <img src={assets.gallery_icon} className="w-5 not-dark:invert" alt="" />

        <p className="text-sm">Community Images</p>
      </div>

      {/* Credits */}
      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition"
      >
        <img src={assets.diamond_icon} className="w-5 dark:invert" alt="" />

        <div className="text-sm">
          <p>Credits : {user?.credits ?? 0}</p>

          <p className="text-xs text-gray-400">Purchase credits to use Mythos</p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center justify-between mt-4 p-3 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />

          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />

          <div className="w-10 h-5 rounded-full bg-gray-400 peer-checked:bg-purple-600 transition"></div>

          <span className="absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
        </label>
      </div>

      {/* User */}
      <div className="mt-4 p-3 border border-gray-300 dark:border-white/15 rounded-md flex items-center gap-3 group cursor-pointer">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="" />

        <p className="flex-1 text-sm truncate">{user ? user.name : "Login your account"}</p>

        {user && (
          <img
            src={assets.logout_icon}
            className="hidden group-hover:block h-5 cursor-pointer not-dark:invert"
            alt=""
          />
        )}
      </div>

      {/* Close Button */}
      <img
        src={assets.close_icon}
        alt=""
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-4 right-4 w-5 cursor-pointer md:hidden not-dark:invert"
      />
    </div>
  );
};

export default Sidebar;
