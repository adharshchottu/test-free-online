export const ListItem = ({ list }) => (
    <ul className="list-disc py-2 pl-12">
        {
            list.map((item) => (
                <li key={item.title}>
                    <b>{item.title}</b>: {item.description}
                </li>
            ))
        }
    </ul>
);
