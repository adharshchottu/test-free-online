import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Text, Image, Group, Rect } from 'react-konva';
import background from '../../assets/kroenger_bg.png';
import kroengerImage from '../../assets/images/kroenger/kroenger.png';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Textarea, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Unsplash from '../Unsplash';

const datas = []

const reorderItems = (arr, pos) => {
    return [...arr.slice(pos), ...arr.slice(0, pos)];
};

const d = new Date();
const monthIndex = d.getMonth();
const RearrangedData = reorderItems(datas, monthIndex);
const RearrangedDataObjects = RearrangedData.reduce((reduced, current) => {
    return [...reduced, ...current]
}, []);

const Kroenger = () => {
    // today date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const [ObservanceDay, setObservanceDay] = useState({
        day: 'Kroenger Day',
        date: '2021-02-04',
        description: 'Kroenger is a not-for-profit',
        dayFontSize: 70,
        descriptionFontSize: 36,
        dayBarWidth: 900,
        dayBarHeight: 700,
        imageHeight:900,
        imageWidth:1200
    });
    const stageRef = useRef(null);
    const [bgImage, setBgImage] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selected, setSelected] = useState({});
    const [selectSvgIcon, setSelectSvgIcon] = useState('');
    const [svgIcon, setSvgIcon] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [date, setDate] = useState(formattedDate);
    const [displayDate, setDisplayDate] = useState('01 AUG 2024');

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    useEffect(() => {
        setObservanceDay(prevState => ({
            ...prevState,
            day: selected.day,
            description: selected.description
        }));
    }, [selected]);

    useEffect(() => {
        const img = new window.Image();
        img.src = background.src;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            // Set the image to state once it is loaded
            setBgImage(img);
        };
    }, [background]);

    // set a default image
    useEffect(() => {
        const img = new window.Image();
        img.src = kroengerImage.src;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            // Set the image to state once it is loaded
            setImage(img);
        };
    }, [kroengerImage]);


    useEffect(() => {
        if (selectSvgIcon) {
            const reader = new FileReader();
            reader.readAsDataURL(selectSvgIcon);
            reader.onload = (e) => {
                const img = new window.Image();
                img.src = e.target.result;
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    // Set the image to state once it is loaded
                    setSvgIcon(img);
                };
            };


        }
    }, [selectSvgIcon]);

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = (e) => {
                const img = new window.Image();
                img.src = e.target.result;
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    setImage(img);
                };
            };
        }
    }, [selectedFile]);

    useEffect(() => {
        const ima = new window.Image();
        ima.src = selectedImage;
        ima.crossOrigin = 'Anonymous';
        ima.onload = () => {
            // Set the image to state once it is loaded
            setImage(ima);
        };
    }, [selectedImage]);

    useEffect(() => {
        const dateParts = date.split('-');

        const months = {
            '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
            '05': 'MAY', '06': 'JUN', '07': 'JUL', '08': 'AUG',
            '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
        };

        const formattedDate = `${dateParts[2]} ${months[dateParts[1]]} ${dateParts[0]}`;
        setDisplayDate(formattedDate);
    }, [date]);

    const handleDayChange = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            day: event.target.value
        }));
    };

    const handleDayFontSizeChange = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            dayFontSize: event.target.value
        }));
    };

    const handleDescriptionChange = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            description: event.target.value
        }));
    };

    const handleDescriptionFontSizeChange = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            descriptionFontSize: event.target.value
        }));
    };

    const handleBarWidth = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            dayBarWidth: Number(event.target.value)
        }));
    };

    const handleBarHeight = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            dayBarHeight: Number(event.target.value)
        }));
    };

    const handleImageWidth = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            imageWidth: Number(event.target.value)
        }));
    };

    const handleImageHeight = (event) => {
        setObservanceDay(prevState => ({
            ...prevState,
            imageHeight: Number(event.target.value)
        }));
    };

    const clipSquare = (ctx, x, y, width, height) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.closePath();
    };

    const handleDownload = () => {
        if (stageRef.current) {
            const dataURL = stageRef.current.toDataURL({
                quality: 1,
                scale: 1,
                width: 1200,
                height: 1200,
                pixelRatio: 2
            });
            console.log(stageRef.current)
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `${ObservanceDay.day}.png`; // Set the desired filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            <section className='pt-16 md:pt-16 lg:pt-24'>
            <h1 className='text-white text-4xl font-bold text-center my-4'>Kroenger Poster Generator Online</h1>
                <div className='flex flex-col'>
                    <div className=''>
                        <div className='max-w-full xl:overflow-hidden transform 
                        scale-[0.25] -translate-x-28 -translate-y-[26rem]
                        md:scale-[0.45] md:-translate-x-28 md:-translate-y-[18rem]
                        lg:scale-[0.35] lg:-translate-x-72 lg:-translate-y-[24rem]
                        xl:scale-50 xl:-translate-x-72 xl:-translate-y-72'>
                            <Stage width={1200} height={1200} ref={stageRef} >
                                <Layer>
                                    <Image
                                        image={bgImage}
                                        x={0}
                                        y={0}
                                        width={1200}
                                        height={1200}
                                    />
                                    <Group clipFunc={(ctx) => clipSquare(ctx, 0, 0, 1200, 900)}>
                                        <Image
                                            image={image}
                                            x={0}
                                            y={0}
                                            width={ObservanceDay.imageWidth}
                                            height={ObservanceDay.imageHeight}
                                            draggable
                                        />
                                    </Group>
                                    <Image
                                        image={svgIcon}
                                        x={25}
                                        y={25}
                                        width={150}
                                        height={150}
                                    />
                                    <Group clipFunc={(ctx) => clipSquare(ctx, -10, 200, ObservanceDay.dayBarWidth, ObservanceDay.dayBarHeight)}>
                                        <Rect fill='#2cb436' width={ObservanceDay.dayBarWidth} height={500} x={0} y={ObservanceDay.dayBarHeight} visible={true} opacity={1} />
                                        <Text
                                            text={ObservanceDay.day}
                                            x={15}
                                            y={ObservanceDay.dayBarHeight + 15}
                                            fontSize={ObservanceDay.dayFontSize}
                                            width={1100}
                                            fontFamily='Montserrat, sans-serif'
                                            fontVariant='600'
                                            fill={'#fff'}
                                            draggable
                                        />
                                    </Group>
                                    <Group clipFunc={(ctx) => clipSquare(ctx, 180, 25, 150, 260)}>
                                        <Text
                                            text={displayDate}
                                            x={180}
                                            y={25}
                                            fontSize={55}
                                            width={150}
                                            fontFamily='Montserrat, sans-serif'
                                            fontVariant='900'
                                            align='center'
                                            fill={'#fff'}
                                            draggable
                                        />
                                    </Group>
                                    <Group clipFunc={(ctx) => clipSquare(ctx, -10, 880, 1210, 250)}>
                                        <Rect fill='#304443' width={1210} height={250} x={-10} y={880} draggable visible={true} opacity={1} />
                                        <Text
                                            text={ObservanceDay.description}
                                            x={15}
                                            y={895}
                                            fontSize={ObservanceDay.descriptionFontSize}
                                            lineHeight={1.1}
                                            width={1170}
                                            fontFamily='Montserrat, sans-serif'
                                            fill={'#fff'}
                                        />
                                    </Group>
                                </Layer>
                            </Stage>
                        </div>
                    </div>
                    <div className='absolute px-4 md:p-8 flex flex-col overflow-y-auto max-h-screen
                    w-auto left-auto top-[34rem]
                    md:w-full md:right-0 md:top-[48rem]
                    lg:w-1/2 lg:right-0 lg:top-32
                    '>
                        <div>
                            <button className='p-2 bg-green-500 text-white rounded-xl my-4' onClick={handleDownload}>Download</button>
                        </div>
                        {RearrangedDataObjects.length > 0 && <div className="flex flex-col space-y-1 mb-4">
                            <Listbox value={selected} onChange={setSelected}>
                                {({ open }) => (
                                    <>
                                        <Label className="block text-sm font-medium leading-6 text-white">Select Day</Label>
                                        <div className="relative">
                                            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                                <span className="flex items-center">
                                                    <span className="ml-3 block truncate">{`${selected.date} - ${selected.day}`}</span>
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </span>
                                            </ListboxButton>

                                            <Transition show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {RearrangedDataObjects.map((item) => (
                                                        <ListboxOption
                                                            key={item.day}
                                                            className={({ focus }) =>
                                                                classNames(
                                                                    focus ? 'bg-indigo-600 text-white' : '',
                                                                    !focus ? 'text-gray-900' : '',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                )
                                                            }
                                                            value={item}
                                                        >
                                                            {({ selected, focus }) => (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <span
                                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                        >
                                                                            {`${item.date} - ${item.day}`}
                                                                        </span>
                                                                    </div>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                focus ? 'text-white' : 'text-indigo-600',
                                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                            )}
                                                                        >
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div>}
                        <div className='flex flex-col space-y-5'>
                            <div className='flex flex-col md:flex-row space-x-2'>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-white">
                                        Day
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm w-96">
                                        <input
                                            value={ObservanceDay.day}
                                            type="text"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={handleDayChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Font Size" className="block text-sm font-medium leading-6 text-white">
                                        Font Size
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={ObservanceDay.dayFontSize}
                                            type="number"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="0.00"
                                            onChange={handleDayFontSizeChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="BG Width" className="block text-sm font-medium leading-6 text-white">
                                        BG Width
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={ObservanceDay.dayBarWidth}
                                            type="number"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="0.00"
                                            onChange={handleBarWidth}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="BG Height" className="block text-sm font-medium leading-6 text-white">
                                        BG Height
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={ObservanceDay.dayBarHeight}
                                            type="number"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="0.00"
                                            onChange={handleBarHeight}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row space-x-2'>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-white">
                                        Definition
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <Textarea onChange={handleDescriptionChange}
                                            cols={70} value={ObservanceDay.description}
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                        </Textarea>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Font Size" className="block text-sm font-medium leading-6 text-white">
                                        Font Size
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={ObservanceDay.descriptionFontSize}
                                            type="number"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="0.00"
                                            onChange={handleDescriptionFontSizeChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div>
                                    <label htmlFor="Font Size" className="block text-sm font-medium leading-6 text-white">
                                        SVG Icon
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            type="file"
                                            accept=".svg"
                                            className="block w-full rounded-md border-0 p-2 text-white ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={(e) => setSelectSvgIcon(e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div>
                                    <label htmlFor="Font Size" className="block text-sm font-medium leading-6 text-white">
                                        Date
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={date}
                                            type="date"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row space-x-2">
                                <div>
                                    <label htmlFor="Image Width" className="block text-sm font-medium leading-6 text-white">
                                        Image Width
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={ObservanceDay.imageWidth}
                                            type="number"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={handleImageWidth}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Image Height" className="block text-sm font-medium leading-6 text-white">
                                        Image Height
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <input
                                            value={ObservanceDay.imageHeight}
                                            type="number"
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={handleImageHeight}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='my-2'>
                            <div className="mb-4">
                                <label htmlFor="imageUpload" className="block text-sm font-medium leading-6 text-white mb-2">
                                    Upload Your Own Image
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="block w-full rounded-md border-0 p-2 text-white ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => {
                                        setSelectedFile(e.target.files[0]);
                                        // Clear Unsplash selection when user uploads a file
                                        setSelectedImage(null);
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <p className="text-white text-sm font-medium mb-2">Or search from Unsplash:</p>
                                <Unsplash setSelectedImage={(imageUrl) => {
                                    setSelectedImage(imageUrl);
                                    // Clear file upload when user selects from Unsplash
                                    setSelectedFile(null);
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Kroenger
