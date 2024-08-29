import { motion } from "framer-motion";

export const ListItem = ({ list }) => (
    <motion.ul
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="list-disc py-2 pl-12"
    >
        {
            list.map((item) => {
                return <>
                    <li>
                        <b>{item.title}</b>: {item.description}
                    </li>
                </>
            })
        }
    </motion.ul>
);
