import { motion } from "framer-motion";

import typinksBannerImage1 from "../assets/images/typinks/International-Left-Handers-Day.png";
import typinksBannerImage2 from "../assets/images/typinks/Vesuvius-Day.png";
import typinksBannerImage3 from "../assets/images/typinks/World-Folklore-Day.png";
import typinksBannerImage4 from "../assets/images/typinks/World-Photography-Day.png";
import { CheckArrowIcon } from "../assets/icons/CheckArrowIcon";

export const TypinksBanner = () => {
  return (
    <section
      className="w-full bg-bgDark2 pt-24 -mt-8  mb-8 sm:-mt-8 sm:mb-24 xl:-mt-8 2xl:mt-0    md:pt-[12vw] lg:pt-16"
      id="typinks"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-wrap items-center 2xl:w-[1450px] xl:w-[1300px] w-11/12 mx-auto md:pl-4 xl:pr-16 xl:pl-16">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div className="mx-auto lg:mx-auto w-11/12 sm:w-4/5 md:w-3/4 lg:w-unset">
              <span className="block-subtitle">Image Generator</span>
              <h2 className="mt-6 mb-8 text-4xl lg:text-5xl block-big-title">
                Generate image with text and icons easily
              </h2>
              <p className="mb-10 text-secondaryText leading-loose">
                Custom set poster generator for typinks. Created using HTML canvas API in reactJS.
              </p>
              <ul className="mb-6 text-primaryText">
                <li className="mb-4 flex">
                  <CheckArrowIcon />
                  <span>Real-time image visualization</span>
                </li>
                <li className="mb-4 flex">
                  <CheckArrowIcon />
                  <span>Upload custom images</span>
                </li>
                <li className="mb-4 flex">
                  <CheckArrowIcon />
                  <span>Easy download option</span>
                </li>
              </ul>
              <button
                className="contained-button w-64 sm:w-52 h-12"
                // onClick={() => setIsModalOpen(true)}
                aria-label="Generage Image for Typinks"
              >
                Generage Image
              </button>
            </div>
          </div>
          <div className="w-3/4 mx-auto lg:w-1/2 flex flex-wrap lg:-mx-4 sm:pr-8 lg:pt-10 justify-center lg:pl-4 xl:px-8">
            <div className="mb-8 lg:mb-0 w-full sm:w-1/2 px-2 lg:px-0">
              <div className="mb-4 py-3 pl-3 pr-2 rounded">
                <img
                  src={typinksBannerImage1.src}
                  alt="International Left Handers Day"
                  className="rounded-xl  main-border-gray mx-auto sm:mx-unset"
                  aria-label="International Left Handers Day"
                />
              </div>
              <div className="py-3 pl-3 pr-2 rounded ">
                <img
                  src={typinksBannerImage2.src}
                  alt="Vesuvius Day"
                  className="rounded-xl  main-border-gray mx-auto sm:mx-unset"
                  aria-label="Vesuvius Day"
                />
              </div>
            </div>
            <div className="w-1/2 lg:mt-20  pt-12 lg:pt-0 px-2 hidden sm:inline-block">
              <div className="mb-4 py-3 pl-3 pr-2 rounded-lg ">
                <img
                  src={typinksBannerImage3.src}
                  alt="World Folklore Day"
                  className="rounded-xl  main-border-gray"
                  aria-label="World Folklore Day"
                />
              </div>
              <div className="py-3 pl-3 pr-2 rounded-lg ">
                <img
                  src={typinksBannerImage4.src}
                  alt="World Photography Day"
                  className="rounded-xl  main-border-gray"
                  aria-label="World Photography Day"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
