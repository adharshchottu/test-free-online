import { useState } from "react";

import { GithubIcon } from "../assets/icons/GithubIcon";

const navbarLinks = [
  { label: "Home", href: "/" },
  { label: "All tools", href: "/#tools" },
  { label: "Blog", href: "/blog" },
];

const sourceCodeUrl = "https://github.com/adharshchottu/test-free-online";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="w-full h-20 flex flex-col justify-center items-center fixed bg-bgDark1 lg:bg-bgDarkTransparent z-40 lg:backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="2xl:w-[1280px] xl:w-10/12 w-11/12 flex justify-between items-center relative">
        <a href="/" aria-label="Home" className="flex justify-start items-center grow basis-0">
          <img src="/logo.png" alt="test free online" className="w-8 h-8 mr-2" />
          <span className="text-white font-['Inter'] font-bold text-xl">Free Online</span>
        </a>

        <div className="hidden lg:flex h-full pb-2">
          {navbarLinks.map(({ href, label }) => (
            <a
              className="text-white text-base leading-6 mx-4 2xl:mx-6 font-medium hover:scale-110 transition h-full pt-2"
              href={href}
              key={label}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="grow basis-0 justify-end hidden lg:flex">
          <a
            className="text-white main-border-gray rounded-xl bg-bgDark2 hover:bg-bgDark3 border-gray-700 pl-6 pr-8 pt-2 pb-2 text-sm flex"
            href={sourceCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            <span className="pt-px">Source code</span>
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden flex flex-col px-2 py-3 border-solid border border-gray-600 rounded-md cursor-pointer hover:bg-bgDark2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="w-5 h-0.5 bg-gray-500 mb-1"></span>
          <span className="w-5 h-0.5 bg-gray-500 mb-1"></span>
          <span className="w-5 h-0.5 bg-gray-500"></span>
        </button>
      </div>

      {/* Mobile navbar */}
      {isOpen && (
        <div className="flex flex-col mt-16 lg:hidden absolute top-4 left-0 bg-bgDark1 z-50 w-full items-center gap-10 py-10 border-y border-solid border-bgDark3">
          {navbarLinks.map(({ label, href }) => (
            <a
              key={href}
              className="text-white text-2xl leading-6 hover:scale-110 transition duration-300"
              href={href}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="outlined-button pl-6 pr-8 pt-2 pb-2 flex"
            href={sourceCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            Source code
          </a>
        </div>
      )}
    </nav>
  );
};
