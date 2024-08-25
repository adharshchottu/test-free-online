import { motion } from "framer-motion";

import kroengerBannerImage1 from "../assets/images/kroenger/World-Plant-Milk-Day.png";
import kroengerBannerImage2 from "../assets/images/kroenger/Shark-awarness-day.jpg";
import { CheckArrowIcon } from "../assets/icons/CheckArrowIcon";

export const KroengerBanner = () => (
  <section className="w-full bg-bgDark2 mt-12 sm:mt-24 mb-12 lg:my-20 lg:mb-24 pt-4" id="kroenger">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-wrap items-center 2xl:w-[1450px] xl:w-[1300px] w-11/12 mx-auto md:pl-4 xl:pr-16 xl:pl-16">
        <div className="w-11/12 sm:w-3/4 mx-auto lg:w-1/3 flex flex-wrap lg:mx-8 sm:pr-8 justify-center order-last lg:order-first">
          <div className="mb-8 lg:mb-0 w-full px-2 lg:pl-16 flex flex-col justify-center md:pl-8">
            <div className="mb-4 py-3 md:pl-3 md:pr-20 lg:pr-12 rounded">
              <img
                src={kroengerBannerImage1.src}
                alt="World Plant Milk Day"
                className="rounded-xl main-border-gray"
              />
            </div>
            <div className="py-3 md:pl-20 lg:pl-12 md:pr-2 rounded ">
              <img
                src={kroengerBannerImage2.src}
                alt="Shark awarness day"
                className="rounded-xl main-border-gray"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 xl:pl-8">
          <div className="mx-auto lg:mx-auto w-11/12 sm:w-4/5 md:w-3/4 lg:w-unset">
            <span className="block-subtitle">Kroenger Poster Designer</span>
            <h2 className="mt-6 mb-8 text-4xl lg:text-5xl block-big-title">
              Observance Day Poster Generator
            </h2>
            <p className="mb-12 text-secondaryText leading-loose">
              Kroenger poster generator built on top of Canvas API with JS for seamless poster generation for environmental observance days
            </p>
            <ul className="mb-6 text-primaryText">
              <li className="mb-4 flex">
                <CheckArrowIcon />
                <span>Custom Icon Upload</span>
              </li>
              <li className="mb-4 flex">
                <CheckArrowIcon />
                <span>Smart date recognizition</span>
              </li>
              <li className="mb-4 flex">
                <CheckArrowIcon />
                <span>Customizable text area</span>
              </li>
            </ul>
            <button
                className="contained-button w-64 sm:w-52 h-12"
                // onClick={() => setIsModalOpen(true)}
                aria-label="Generage Poster for Typinks"
              >
                Generage Poster
              </button>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);
