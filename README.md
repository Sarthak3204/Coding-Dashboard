# Coding Dashboard

This is a MERN stack application with authentication. This is for a SPA (Single Page Application) workflow that uses the [Vite](https://vite.dev) Build tool

<details>
  <summary>Screenshots</summary>
  <img src="./frontend/public/sign_in.png" name="sign_in">
  <img src="./frontend/public/sign_up.png" name="sign_up">
  <img src="./frontend/public/profile1.png" name="profile1">
  <img src="./frontend/public/profile2.png" name="profile2">
  <img src="./frontend/public/contest.png" name="contest">
  <img src="./frontend/public/codeforces1.png" name="codeforces1">
  <img src="./frontend/public/codeforces2.png" name="codeforces2">
  <img src="./frontend/public/atcoder1.png" name="atcoder1">
  <img src="./frontend/public/atcoder2.png" name="atcoder2">
</details>

It includes the following:

- Backend API with Express & MongoDB
- Routes for auth, logout, register, update profile, delete profile
- JWT authentication stored in HTTP-only cookie
- Protected routes and endpoints
- Custom middleware to check JSON web token and store in cookie
- Custom error middleware
- React frontend to register, login, logout, view profile, and update profile
- React Bootstrap UI library
- React Toastify notifications

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

### Env Variables

Create `.env` file in root directory and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
```

Change the JWT_SECRET to what you want

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Run

```
# Run backend (:5000)
npm run server

# Run frontend (:3000)
npm run dev
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```
