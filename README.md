# Bulmarks

![Logo](https://raw.githubusercontent.com/ViktorAtanasof/bulmarks/main/frontend/src/assets/logo/logo.png)

*Bulmarks is a user-friendly project designed to help people easily discover and explore a variety of landmarks throughout Bulgaria. With its intuitive interface and modern design, Bulmarks is perfect for tourists and locals alike. Start your journey today and discover the rich history and natural beauty of Bulgaria's many landmarks with Bulmarks.*

[![GPLv3 License](https://img.shields.io/github/license/ViktorAtanasof/bulmarks?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

[**Live Demo**](https://bulmarks.vercel.app/)

![Logo](https://raw.githubusercontent.com/ViktorAtanasof/bulmarks/main/frontend/src/assets/images/home.png)

## Dependencies

**Frontend**
- [React 18.2.0]()
- [React-router-dom 6.9.0]()
- [Tailwind CSS 3.2.7]()
- [Leaflet 1.9.3]()
- [React-leaflet 4.2.1]()
- [Swiper 9.1.1]()
- [React-toastify 9.1.1]()
- [React-icons 4.8.0]()
- [UUID 9.0.0]()

**Backend**
- [Firebase 9.17.2](https://firebase.google.com/)
- [Dotenv-webpack 8.0.1]()



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
  
  # Others (Home, Not Found)
  /
  /anything
```
