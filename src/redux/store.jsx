// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/registerSlice";
import rideFormReducer from "./features/rideFormSlice";
import publishFormReducer from "./features/publishForm";
import profileReducer from "./features/profile/profileSlice";
import suggestionReducer from "./features/suggestionSlice"; // adjust path
import searchReducer from "./features/searchSlice";
import usersRidesReducer from "./features/profile/usersRidesSlice";
import bookRideReducer from "./features/profile/bookingSlice";
import totalRidesReducer from "./features/admin/totalRidesSlice";
import userReducer from "./features/admin/userSlice";
import rideBookingReducer from "./features/rideBookingSlice";
import bookingReducer from "./features/profile/bookingSlice";
import approveRidesReducer from "./features/profile/approveRidesSlice";
import userWisePublishRidesReducer from "./features/admin/userWisePublishRidesSlice";
import reportReducer from "./features/reportSlice";
import userStatusReducer from "./features/admin/userStatusSlice";
import bookingRidesReducer from "./features/admin/bookingRidesSlice";
import supportReducer from './features/admin/supportSlice';
import mostVisitedReducer from './features/mostVisitedSlice';
import commissionReducer from './features/admin/commissionSlice';
import adminProfileReducer from './features/admin/adminProfileSlice';
import todayRidesReducer from './features/admin/todayRidesSlice';
import kycReducer from './features/profile/kycSlice';
import adminKycListReducer from "./features/admin/adminKycListSlice";
import kycStatusReducer from "./features/admin/kycStatusSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    rideForm: rideFormReducer,
    publishForm: publishFormReducer,
    profile: profileReducer,
    suggestion: suggestionReducer,
    search: searchReducer,
    usersRides: usersRidesReducer,
    bookRide: bookRideReducer,
    booking: bookingReducer,
    totalRides: totalRidesReducer,
    support: supportReducer,
    users: userReducer,
    rideBooking: rideBookingReducer,
    approveRides: approveRidesReducer,
    userWisePublishRides: userWisePublishRidesReducer,
    report: reportReducer,
    userStatus: userStatusReducer,
    bookingRides: bookingRidesReducer,
    mostVisited: mostVisitedReducer,
    commission: commissionReducer,
    adminProfile: adminProfileReducer,
    todayRides: todayRidesReducer,
    kyc: kycReducer,
    adminKycListSlice: adminKycListReducer,
    kycStatusSlice:kycStatusReducer

    

  },
});

export default store;
