import { useState } from "react";

const Unsplash = ({ setSelectedImage, orientation = 'landscape' }) => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);

    const handleSearchQuery = (event) => {
        setQuery(event.target.value);
    }

    const searchButton = () => {
        if (query != "") {
            const API_URL = `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${query}&client_id=X6PNinIaFP-nyFm55TbVkFF4z0y2itDIliN2LK8T0BA&orientation=${orientation}`;

            const fetchImages = async () => {
                try {
                    const response = await fetch(
                        API_URL
                    );
                    const data = await response.json();
                    setImages(data.results);
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            };
            fetchImages();
        }
    }

    const selectImage = (url) => {
        setSelectedImage(url);
    }

    return <>
        <div className="mx-auto">
            <div>
                <label htmlFor="Font Size" className="block text-sm font-medium leading-6 text-white">
                    Image Search
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                        value={query}
                        type="text"
                        className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Search image"
                        onChange={handleSearchQuery}
                    />
                </div>
                <button className="bg-violet-700 text-white p-2 rounded-md my-4" onClick={searchButton}>Search</button>
            </div>
            <div className="mt-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Select image</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
                    {images.map((image) => (
                        <div key={image.id} className="group relative" onClick={() => selectImage(image.urls.regular)}>
                            <div className="aspect-h-1 aspect-w-1 w-48 h-48 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                                <img
                                    src={image.urls.regular}
                                    alt={image.description}
                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-white">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {image.description && image.description.slice(0, 10)}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

export default Unsplash;