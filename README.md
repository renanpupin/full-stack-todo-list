# full-stack-todo-list
Full stack TODO list showing best practices with concepts of backend, frontend e mobile development

## Setup
- Backend
    ```
    cd backend
    npm install
    npm test
    node server.js
    ```

- Frontend
    ```
    cd frontend
    yarn install
    yarn test
    yarn start
    ```
  
- Mobile
    ```
    cd mobile
    yarn install
    cd ios && pod install && cd ..
    yarn test
    yarn ios
    yarn android
    ```

## Backend
Express REST API

## Frontend
React app

## Mobile
React Native app

## Common
Reusable code

## Fold structure
```
full-stack-todo-list
│   README.md
│
└───backend
│   │   package.json
│   │   server.js
│   │   README.md
│   │   src
│   │   │   configs
│   │   │   controllers
│   │   │   middlewares
│   │   │   models
│   │   │   routes
│   │   │   services
│   │   │   views/docs
│   │   tests
│   │   │   todo.js
│   
└───frontend
│   │   src
│   │   package.json
│   │   README.md
│   
└───mobile
│   │   src
│   │   package.json
│   │   README.md
│   
└───common
    │   resources
    │   README.md
```

## Concepts
- API Documentation ([APIDOC js](https://apidocjs.com/))
- Code reuse (common folder)
- Automated tests (chai, mocha, jest)
- Scalable (Multi instance cluster)
- Real time (Socket.io)

## Technologies
nodejs, javascript, react, react-native, socket.io, mocha, chai, jest
