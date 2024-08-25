import { motion } from "framer-motion";

import serverSideEvents from "../assets/images/sse/server-side-events.png";
import { navigate } from "astro/virtual-modules/transitions-router.js";

export const ServerSideEventsBanner = () => {
  return (
    <section className="lg:mb-16 w-full flex flex-col justify-center items-center bg-bgDark1" id="sse">
      <div className="shape-divider-bottom-1665696614">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="bg-bgDark2  fill-bgDark2"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="bg-bgDark1  fill-bgDark1"
          ></path>
        </svg>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className=" 2xl:w-[1150px] xl:w-[1050px]  md:w-4/5 flex justify-center bg-bgDark1 pt-12 lg:pt-24 pb-8 lg:pb-20 mx-auto lg:flex-row flex-col">
          <div className="w-3/4 lg:w-1/2 flex flex-col lg:mx-unset mx-auto">
            <span className="block-subtitle">Server Side Events</span>
            <h2 className="mt-10 mb-8 text-4xl lg:text-5xl block-big-title">
              Test SSE Seamlessly
            </h2>
            <p className="mb-16 text-secondaryText leading-loose">
              Server side events can be tested easily here with elegant UI and error messaging for better testing exerience
            </p>
            <button
              className="w-[210px] h-12 contained-button mr-10 "
              onClick={() => navigate("/sse")}
              aria-label="Test SSE"
            >
              Test SSE Now
            </button>
          </div>
          <div className="w-4/5 lg:w-1/2 lg:pl-16 flex justify-center mx-auto pt-16 lg:pt-0">
            <img
              src={serverSideEvents.src}
              alt="Feature image"
              className="rounded-xl  main-border-gray"
            />
          </div>
        </div>
      </motion.div>
      <div className="shape-divider-top-1665696661 w-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="bg-bgDark2 fill-bgDark2"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="bg-bgDark1 fill-bgDark1"
          ></path>
        </svg>
      </div>
    </section>
  );
};
