# My Interesting Projects Website

Welcome to the repository for my personal website. This project showcases a collection of my work, with a focus on creating an engaging and interactive user experience that harks back to the retro aesthetics of early computing.

## Features

- **Retro Theme**: The website features a unique retro computer or terminal theme, complete with text scanlines, a blinking cursor, and monochrome color schemes.
- **Interactive Search**: Users can search for projects using a dynamic input that simulates a command-line interface.
- **Category Filtering**: Projects are categorized into several groups such as Machine Learning (ML), Physics, Real Time, Security Operations (Sec ops), and Random, allowing users to filter projects by these categories.
- **Dynamic Project Display**: Clicking on a project in the list displays its details on the right panel, with content rendered from Markdown to HTML for easy updating.
- **Sound Effects**: Interactive audio feedback enhances the user experience, with sounds for clicking, hovering, and toggling audio.

## Technologies Used

- **Vue.js**: Utilizes Vue 3 Composition API for reactive state management and component-based architecture.
- **CSS**: Custom styles with a focus on the retro theme, including animations for blinking elements and cursor effects.
- **Markdown Rendering**: Uses the `marked` library to convert Markdown files into HTML, allowing for easy content management.
- **Custom Sound Service**: A bespoke service for handling sound effects based on user interactions, enhancing the nostalgia factor.

## Project Structure

/components # Vue components for various parts of the site
/services # JavaScript services, including sound management
/assets # Static assets such as CSS files, images, and sounds
/views # Vue components for whole pages or major sections


## Setup and Development

To get the project up and running on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yourrepository.git
```

2. Install dependencies

```bash
npm install
```

3. Serve with hot reload at localhost:

```bash
npm run serve
```

## Contributing

I welcome contributions to this project! If you have suggestions or improvements, please fork the repository and create a pull request.
