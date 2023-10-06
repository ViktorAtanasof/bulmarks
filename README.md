# Bulmarks

![Logo](https://raw.githubusercontent.com/ViktorAtanasof/bulmarks/main/frontend/src/assets/logo/logo.png)

*Bulmarks is a user-friendly project designed to help people easily discover and explore a variety of landmarks throughout Bulgaria. With its intuitive interface and modern design, Bulmarks is perfect for tourists and locals alike. Start your journey today and discover the rich history and natural beauty of Bulgaria's many landmarks with Bulmarks.*

[![GPLv3 License](https://img.shields.io/github/license/ViktorAtanasof/bulmarks?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

[**Live Demo**](https://bulmarks.vercel.app/)

![Logo](https://raw.githubusercontent.com/ViktorAtanasof/bulmarks/main/frontend/src/assets/images/home.png)

## Dependencies

**Frontend**
- [React 18.2.0](https://react.dev/)
- [TypeScript 4.9.5](https://www.typescriptlang.org/)
- [React-router-dom 6.9.0](https://reactrouter.com/en/main)
- [React-hook-form 7.43.8](https://react-hook-form.com/)
- [Tailwind CSS 3.2.7](https://tailwindcss.com/)
- [Leaflet 1.9.3](https://leafletjs.com/)
- [React-leaflet 4.2.1](https://react-leaflet.js.org/)
- [Swiper 9.1.1](https://swiperjs.com/)
- [React-toastify 9.1.1](https://fkhadra.github.io/react-toastify/introduction/)
- [React-icons 4.8.0](https://react-icons.github.io/react-icons)
- [UUID 9.0.0](https://www.npmjs.com/package/uuid?activeTab=readme)

**Backend**
- [Firebase 9.17.2](https://firebase.google.com/)
- [Dotenv-webpack 8.0.1](https://www.npmjs.com/package/dotenv-webpack?activeTab=readme)

## Installation & Setup

1.1 Navigate to `frontend/` directory.

```bash
  cd frontend
```
1.2 Install dependencies & run `npm start`
```bash
  # Install dependencies
  npm install

  # Start frontend
  npm start
```

## Routes

```bash
  # Landmarks
  /landmarks
  /category/{categoryName}
  /category/{categoryName}/{landmarkId}
  /create-landmark
  /edit-landmark/{landmarkId}

  # Auth
  /sign-up
  /sign-in
  /forgot-password
  /profile
  /profile/favourites
  
  # Others (Home, Not Found)
  /
  /anything
```
