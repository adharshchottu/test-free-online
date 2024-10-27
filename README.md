# Test Free Online Tools

Test online tools for free.

**Fun Motivation: I am trying to use every UI frameworks that Astro can integrate**

## Typinks Poster Generator

A social media poster generator built with React, designed to create customizable images for observance days. It allows users to generate images with customizable text, date, background, and more for social media sharing. Try [Typinks Poster Generator](https://test-free.online/typinks-poster-generator/) online now.

### Features

- **Customizable Text and Date**: Update the observance day name, date, and description text.
- **Font Size Control**: Adjust font sizes for both the day and description text.
- **Dynamic Backgrounds**: Select or upload a custom image background using Unsplash or local files.
- **Downloadable Images**: Download generated posters as high-quality PNG files.
- **Responsive Design**: Adapted for various screen sizes with optimized controls.

### Technologies Used

- **React**: JavaScript library for building user interfaces.
- **react-konva**: Library for drawing complex, interactive 2D graphics in React.
- **Headless UI**: Unstyled component library for accessible, interactive UI elements.
- **Unsplash**: API integration for searching and adding Unsplash images.
- **CSS**: Custom styling for responsive layouts and custom inputs.

### Usage

1. **Customize the Text**:
   - Change the observance day name and description in the input fields.

2. **Adjust Date**:
   - The date automatically defaults to today’s date, but it can be customized.

3. **Customize Font and Position**:
   - Adjust font sizes and vertical position (`Y`) for both the day and description text.

4. **Background Selection**:
   - Select an image from Unsplash or upload a custom background image.

5. **Download Poster**:
   - Click the "Download" button to download the poster as a PNG file.

### Components Overview

- **Stage and Layers**: Provided by `react-konva` to handle the background, text, and overlays.
- **Image Handling**: Background and custom image layers for dynamic visuals.
- **Customizable Input Fields**: Includes font size, position, day, and description settings.

### Code Structure

- **`Typinks.js`**: Main file that defines the UI and handles the image generation.
- **`react-konva` Components**: `Stage`, `Layer`, `Group`, `Text`, and `Image` components for layering graphics.
- **Event Handlers**: Functions to manage state updates for day, font size, image uploads, and description settings.


## Kroenger Observance Day Creator

A React application built with `react-konva` that allows users to create and customize observance day posters, particularly suited for environmental awareness days. The user can select or upload a background image, customize text elements (day name, date, and description), adjust font sizes, and download the resulting image as a PNG. Try [Kroenger Poster Generator](https://test-free.online/kroenger-poster-generator/) online now.

### Features

- **Background Image**: Custom background image for your observance day poster.
- **Customizable Text**: Set and style the observance day name, date, and description.
- **Font and Layout Adjustment**: Adjust font sizes, background dimensions, and bar colors to create the desired design.
- **Downloadable Poster**: Save the final design as a high-quality PNG.

### Technologies Used

- **React**: Core UI framework.
- **React Konva**: Used for canvas-based rendering of the customizable poster.
- **Headless UI**: UI components for input fields and selections.
- **JavaScript**: Core scripting for interactive features.
- **Unsplash API** (Optional): For fetching images directly from Unsplash (needs API setup).

### File Structure

- **components/**
  - `Unsplash.js`: For fetching images from Unsplash.
- **assets/**
  - `kroenger_bg.png`: Default background image.
- **App Files**
  - `Kroenger.js`: Main component with all rendering and customization logic.

### Usage

1. **Select Date**: Automatically displays today’s date, but can be adjusted.
2. **Custom Day Name & Description**: Enter a name and description for the observance day.
3. **Upload Background Image**: Set a custom background using `Unsplash` or a local upload.
4. **Customize Text Appearance**: Adjust the font size and bar size for both the day name and description.
5. **Download**: Click the "Download" button to save the poster as a PNG.

### Customization Options

- **Day Name**: Change the displayed day name and its font size.
- **Description**: Enter a custom description and set its font size.
- **Date Display**: Automatically formats the selected date as "DD MMM YYYY".
- **Background Color & Size**: Adjust the day bar's width and height.

### Code Highlights

- **Canvas Rendering**: Using `react-konva` to render canvas elements.
- **Dynamic Data Management**: `useState` and `useEffect` for live updates.
- **Image Processing**: SVG and raster images processed via `FileReader` and `Image`.
- **Download Function**: Captures and saves canvas elements as PNG.

### Dependencies

- `react-konva`
- `headlessui/react`
- `heroicons`
- `@heroicons/react`


## Server Side Events(SSE) Test Online

A simple SSE (Server-Sent Events) testing tool built with React. It enables users to connect to an SSE endpoint, receive real-time updates, and view messages as they are streamed from the server. The app also provides feedback on connection status and error handling. Test [Server Side Events](https://test-free.online/sse/) online now.

### Features

- **Connect to SSE Endpoint**: Enter an SSE URL to connect and start receiving server-sent events.
- **Real-Time Messages**: Display incoming messages from the server in real time.
- **Story Mode**: Option to toggle between viewing messages individually or as a continuous story.
- **Status & Error Feedback**: Display connection status updates and errors to improve user experience.
- **Reconnect on Failure**: Automatically attempts to reconnect if the server temporarily disconnects.

### Technologies Used

- **React**: Frontend framework.
- **Lucide-React**: For icons indicating status and errors.
- **EventSource API**: To establish a connection with the SSE endpoint.

### Usage

1. **Enter SSE URL**: In the input field, enter a valid SSE endpoint URL (default: `https://sse.test-free.online/api/story`).
2. **Connect**: Click "Connect" to start receiving events from the server.
3. **View Messages**: 
   - Messages appear in a scrollable box.
   - Toggle **Story Mode** to switch between viewing messages individually or as a continuous story.
4. **Disconnect**: Click "Disconnect" to close the SSE connection.

### Components

- **SSETester**: Main component containing:
  - URL input for specifying the SSE endpoint.
  - Connect and disconnect buttons.
  - Message display area with optional "Story Mode."
  - Status and error alerts using Lucide icons.

### Key Functions

- **connectSSE**: Initiates a connection to the SSE endpoint, updates the status, and handles incoming messages.
- **disconnectSSE**: Closes the connection to the SSE endpoint and updates the status.
- **renderAlert**: Displays alerts for connection status or error messages.

### Dependencies

- `react`
- `lucide-react`: For icons indicating connection status and errors.

### Customization Options

- **Story Mode**: Toggle `Story Mode` to join messages into a continuous narrative or display each message separately.
- **URL Input**: Change the SSE endpoint by typing a new URL into the input field.

### Error Handling

The component handles errors from the SSE endpoint, providing user-friendly messages for connectivity issues and server errors. Additionally, it will attempt to reconnect if the server disconnects temporarily.

## Lua Script Executor

a simple interface for testing Lua scripts with Redis on a server. It allows you to write and execute Lua scripts, pass arguments to them, and view the execution results or errors. Built with React, this tool leverages Monaco Editor for script editing and uses a REST API for server communication. Test [Redis Lua Script](https://test-free.online/redis-lua/) online now.

### Features

- **Lua Script Editor**: An embedded editor (Monaco Editor) for writing Lua scripts.
- **Argument Support**: Enter arguments in a comma-separated format to pass into the Lua script.
- **Execution Results**: View the results directly, either as a structured list or a string.
- **Error Handling**: Errors are captured and displayed to assist in debugging.
- **Status Indicator**: Shows HTTP status codes for each execution request.

### Usage

1. **Edit the Lua Script**: Write or modify the Lua script in the editor. By default, it starts with `return "ok"`.
2. **Enter Arguments**: In the "Arguments" field, enter arguments as a comma-separated list (e.g., `arg1, arg2, [nested array]`). Arguments enclosed in square brackets (e.g., `[arg1, arg2]`) will not be split.
3. **Execute the Script**: Click the **Execute Script** button to run the Lua script.
4. **View Results**: The results or errors will display in the "Result" panel on the right. HTTP status codes will appear as a badge above the result.

### Components

#### `LuaScriptExecutor`

Main component for executing Lua scripts:
- **State Variables**:
  - `script`: Stores the Lua script text.
  - `args`: Stores arguments as a comma-separated string.
  - `result`: Stores execution result, which may be a string or array.
  - `error`: Stores any error message.
  - `statusCode`: Stores the HTTP status code from the response.

- **Functions**:
  - `handleSubmit`: Sends the script and arguments to the server API and fetches the result.
  - `renderResult`: Renders the execution result or displays an error if encountered.

#### Dependencies

- **React**: For building UI components.
- **Monaco Editor**: Provides Lua syntax highlighting and code editing.
- **Lucide-React Icons**: For adding icons in error and status alerts.

### API Endpoint

The server API endpoint for executing Lua scripts is pre-configured at:

```
https://redis-server.test-free.online/api/redis-lua
```

This endpoint receives the script and arguments in JSON format:
```json
{
    "script": "<Lua script text>",
    "arguments": ["arg1", "arg2", "arg3"]
}
```

The server should return a JSON response with the script's execution result or error.

### Example

1. Write a Lua script such as:
   ```lua
   local x = KEYS[1]
   return "Hello, " .. x
   ```
   
2. Enter `arg1` in the arguments field and execute.
3. Observe the output, which should return `"Hello, arg1"` if the script runs successfully.

### Troubleshooting

- **Script Errors**: If the server returns an error, it will display in the "Error" panel.
- **Connection Errors**: Ensure the API endpoint is correct and reachable.