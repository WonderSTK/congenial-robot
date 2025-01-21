# Quick start guide for FeedWire

## Introduction
Welcome to our application! Designed to bring the best of both worlds, it combines the majority of social media functionalities with a comprehensive RSS feed management system. With features like post creation, comments, likes, and saving posts, it offers a rich social experience. Additionally, it provides powerful RSS capabilities, allowing users to explore the latest news from their favorite sources, access a curated "Today News" section, and save articles for later. To get a glimpse of the application in action, we have prepared a video demonstration. You can watch it [SHOWCASE VIDEO](https://www.youtube.com/watch?v=5Ux5f0utAOs). For access to the application, please visit the following link: [DEMO](https://boisterous-duckanoo-2ad4b1.netlify.app/).

## Setting up the development environment

### Requirements

#### Vue 3 + Vite
This application uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

#### Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

#### Install project dependencies

```shell
npm install
or
yarn install
```

The following [dependencies](#dependencies) will be installed:

```js
{
  "name": "amicpole",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "serve": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vuepic/vue-datepicker": "^4.4.0",
    "autoprefixer": "^10.4.14",
    "axios": "^1.3.6",
    "daisyui": "^2.51.5",
    "exceljs": "^4.3.0",
    "firebase": "^9.22.0",
    "pinia": "^2.0.33",
    "postcss": "^8.4.21",
    "sortablejs": "^1.15.0",
    "vue": "^3.2.47",
    "vue-advanced-chat": "^2.0.7",
    "vue-advanced-cropper": "^2.8.8",
    "vue-router": "^4.1.6"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.1.0",
    "@voerro/vue-tagsinput": "^2.7.1",
    "sass": "^1.60.0",
    "tailwindcss": "^3.2.7",
    "vite": "^4.2.0"
  }
}
```

### Application Launch
Don't forget to change your macros to launch your scripts as you wish, by default I left it as vue-cli, that is to say that to launch the project you must do:

```shell
npm run serve
```

## Dependencies

- **[@vuepic/vue-datepicker](https://vue3datepicker.com/installation/)**: A date picker component for Vue.js.
  > **Note:** The `@vuepic/vue-datepicker` library was used to create the `InputDate.vue` component, which is notably used for the "Read Later" functionality and for setting the promotion duration of a content.

- **[autoprefixer](https://github.com/postcss/autoprefixer)**: A plugin to parse CSS and add vendor prefixes automatically.

- **[axios](https://github.com/axios/axios)**: A promise-based HTTP client for making API requests.
  > **Note:** The `axios` library is used to fetch data from RSS feeds in the `fetchRssFeed` action of the `rssStore.js` store.

- **[daisyui](https://daisyui.com/)**: A utility-first CSS framework for rapidly building custom designs.

- **[exceljs](https://github.com/exceljs/exceljs)**: A library for reading, manipulating, and writing Excel files.
  > **Note:** The `exceljs` library is used to export the saved content in your application. Specifically, it is utilized in the `exportBookmarks` function in the `MyBookmarks.vue` component.

- **[firebase](https://firebase.google.com/)**: A platform for building web and mobile applications backed by Google Cloud.
  > **Note:** Firebase is used for real-time data storage in the chat application. It is responsible for storing and retrieving chat messages in real time. The setup and configuration details can be found in the `.env` file.

- **[pinia](https://pinia.vuejs.org/)**: A state management system for Vue.js.

- **[postcss](https://github.com/postcss/postcss)**: A tool for transforming CSS with JavaScript plugins.

- **[sortablejs](https://github.com/SortableJS/Sortable)**: A library for creating sortable lists and grids.
  > **Note:** SortableJS is utilized in the creation of the ToDoList, enabling the ability to drag and reorder tasks. This functionality allows users to easily rearrange tasks according to their preference.

- **[vue](https://v3.vuejs.org/)**: A progressive JavaScript framework for building user interfaces.

- **[vue-advanced-chat](https://github.com/antoine92190/vue-advanced-chat)**: A feature-rich chat component for Vue.js.

- **[vue-advanced-cropper](https://github.com/Norserium/vue-advanced-cropper)**: A powerful image cropper component for Vue.js.

- **[vue-router](https://next.router.vuejs.org/)**: The official router for Vue.js.

- **[@vitejs/plugin-vue](https://github.com/vitejs/vite)**: A Vite plugin for Vue.js development.

- **[@voerro/vue-tagsinput](https://github.com/voerro/vue-tagsinput)**: A tags input component for Vue.js.
  > **Note:** The `@voerro/vue-tagsinput` library is used in the creation of the `InputTags.vue` component. This component enables users to input and manage tags for organizing and categorizing various elements.

- **[sass](https://sass-lang.com/)**: A CSS extension language.

- **[tailwindcss](https://tailwindcss.com/)**: A utility-first CSS framework.

- **[vite](https://vitejs.dev/)**: A fast development server and build tool for modern web applications.

- **[hammer.js](https://hammerjs.github.io/)**: A library used to detect swipe gestures.
  > **Note:** hammer.js is only used when accessing the application on mobile devices to enable swipe gesture detection for opening the navigation menu.

Please refer to the respective documentation for detailed information on how to use each library.


## Pinia Stores

In this application, Pinia stores are utilized to centralize the storage and manipulation of application data. By isolating the data management in stores, modifications and actions can be easily controlled and coordinated.

*<u>Store files:</u>* Each store represents a specific domain or module of the application
![Store File Naming](https://i.ibb.co/DRFkrPm/structure.png)


*<u>Store State:</u>* The state defines the data structure and initial values for the specific store
![Store State](https://i.ibb.co/pwWZGjc/state.png)

*<u>Store Actions:</u>* Actions define the operations or functions that can be performed on the store's data, can be used on each vue
![Store Actions](https://i.ibb.co/JCXbYpP/actions.png)


*<u>Store Getters:</u>* Getters retrieve and compute derived values based on the store's state
![Store Getters](https://i.ibb.co/FXNvvVY/getters.png)


Using Pinia stores provides the following benefits:
- Centralizes and isolates data storage and manipulation in a single location.
- Facilitates easy modification and coordination of actions, such as integrating database calls.
- Offers detailed insight into the required application data structure.
- Enables straightforward renaming of stores if needed.
- Encourages following the appropriate data types to minimize future code changes.

Feel free to modify the naming conventions, structure, and details of the store code based on your application's specific requirements.

### Usage examples for using a store in vue
You only need to import your store is the used one in order to have access to all its content:

```js
import { useUsersStore } from "@/stores/usersStore"
const usersStore = useUsersStore()

// Call getters
usersStore.getUsername
usersStore.getProfileLink
usersStore.getPdpLink

// Call actions
usersStore.logout()
usersStore.follow(192 /* userId to follow */)

// Change/Migrate value directly with pinia
usersStore.user.username = "NewPseudo"
usersStore.user.email = "myemail@example.com"
```

## Components

In this application, a highly atomic design approach has been followed to ensure modularity and reusability. The components have been organized in a directory structure that promotes easy extraction of specific features or components that are of interest.

*<u>Component directory structure:</u>* The components are organized based on their atomic nature, allowing easy access and extraction of individual components or functionalities.

![Component Directory Structure](https://i.ibb.co/jD9tV6N/Capture-d-e-cran-2023-06-09-a-22-07-14.png)


The atomic design methodology provides the following advantages:
- **Modularity**: Components are structured in a way that each encapsulates a specific functionality or feature. This promotes code reusability and maintainability.
- **Reusability**: Components can be easily extracted and reused in other parts of the application or in future projects, thanks to their atomic design.
- **Isolation**: Each component is designed to be self-contained and independent. This facilitates easier testing and debugging.

By adhering to the atomic design principles, your application benefits from a flexible and scalable architecture. Developers can selectively retrieve and integrate only the desired components or functionalities, ensuring efficient development and customization.

Feel free to explore the `components` directory and leverage the modular nature of the components to enhance your application as needed.
