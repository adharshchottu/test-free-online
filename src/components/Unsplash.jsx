import { useState } from "react";

const Unsplash = ({ setSelectedImage, orientation = 'landscape' }) => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchQuery = (event) => {
        setQuery(event.target.value);
    }

    const searchImages = async (page = 1) => {
        if (query.trim() === "") return;
        
        setIsLoading(true);
        const API_URL = `https://api.unsplash.com/search/photos?page=${page}&per_page=30&query=${query}&client_id=X6PNinIaFP-nyFm55TbVkFF4z0y2itDIliN2LK8T0BA&orientation=${orientation}`;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (page === 1) {
                setImages(data.results);
            } else {
                setImages(prevImages => [...prevImages, ...data.results]);
            }
            
            setTotalPages(Math.ceil(data.total / 30));
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchButton = () => {
        setCurrentPage(1);
        setImages([]);
        searchImages(1);
    };

    const loadMoreImages = () => {
        if (currentPage < totalPages && !isLoading) {
            searchImages(currentPage + 1);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchButton();
        }
    };

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
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <button 
                    className="bg-violet-700 text-white p-2 rounded-md my-4 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={searchButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Select image</h2>
                    {images.length > 0 && (
                        <span className="text-sm text-gray-300">
                            Showing {images.length} images {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
                        </span>
                    )}
                </div>

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
                
                {/* Load More Button */}
                {currentPage < totalPages && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={loadMoreImages}
                            disabled={isLoading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Loading...' : 'Load More Images'}
                        </button>
                    </div>
                )}
                
                {/* No Results Message */}
                {images.length === 0 && query && !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No images found for "{query}". Try a different search term.</p>
                    </div>
                )}
            </div>
        </div>
    </>
}

export default Unsplash;