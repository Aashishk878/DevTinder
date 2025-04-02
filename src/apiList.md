# DEVTinder APIs

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view => view profile
- PATCH /profile/edit => edit profile {usual data}
- PATCH /profile/password => edit pswrd like data of our profile

# connectionRequestRouter
- POST  /request/send/interested/:userId => send request => right swipe
- POST /request/send/ignored/:userId => ignore => left swipe
- POST /request/review/accepted/:requestId => accept connection req
- POST /request/review/rejected/:requestId => reject connection req

# userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform

STATUS : ignore, interested, accepted, rejected 