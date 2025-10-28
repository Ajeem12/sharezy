// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   TextField,
//   Button,
//   Chip,
//   FormControlLabel,
//   Switch,
// } from "@mui/material";
// import {
//   MdLocationOn,
//   MdSwapHoriz,
//   MdCalendarToday,
//   MdAccessTime,
//   MdPeople,
//   MdAttachMoney,
//   MdRepeat,
// } from "react-icons/md";
// import { motion } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { publishRide, resetForm } from "../redux/features/publishForm";
// import {
//   fetchSuggestion,
//   clearSuggestions,
// } from "../redux/features/suggestionSlice";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const seatOptions = Array.from({ length: 20 }, (_, i) => ({
//   value: i + 1,
//   label: `${i + 1} seat${i > 0 ? "s" : ""}`,
// }));

// const weekdays = [
//   { id: 0, label: "S", full: "Sunday" },
//   { id: 1, label: "M", full: "Monday" },
//   { id: 2, label: "T", full: "Tuesday" },
//   { id: 3, label: "W", full: "Wednesday" },
//   { id: 4, label: "T", full: "Thursday" },
//   { id: 5, label: "F", full: "Friday" },
//   { id: 6, label: "S", full: "Saturday" },
// ];
// //
// const idToDayName = {
//   0: "Sunday",
//   1: "Monday",
//   2: "Tuesday",
//   3: "Wednesday",
//   4: "Thursday",
//   5: "Friday",
//   6: "Saturday",
// };

// //

// const PublishForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const suggestions = useSelector((state) => state.suggestion);
//   const { success } = useSelector((state) => state.publishForm);
//   const { loading } = useSelector((state) => state.publishForm);

//   const [fromCity, setFromCity] = useState(null);
//   const [toCity, setToCity] = useState(null);
//   const [pickupPoint, setPickupPoint] = useState("");
//   const [dropPoint, setDropPoint] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [seats, setSeats] = useState(seatOptions[0]);
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [vehicleName, setVehicleName] = useState("");
//   const [price, setPrice] = useState("");
//   const [rideShareEnabled, setRideShareEnabled] = useState(true);
//   const [remarks, setRemarks] = useState("");
//   const [isDaily, setIsDaily] = useState(false);
//   const [selectedDays, setSelectedDays] = useState([]);

//   const handleFromInputChange = (event, value, reason) => {
//     if (reason === "input" && value.length > 1) {
//       dispatch(fetchSuggestion({ input: value, field: "from" }));
//     } else if (reason === "clear") {
//       dispatch(clearSuggestions("from"));
//     }
//   };

//   const handleToInputChange = (event, value, reason) => {
//     if (reason === "input" && value.length > 1) {
//       dispatch(fetchSuggestion({ input: value, field: "to" }));
//     } else if (reason === "clear") {
//       dispatch(clearSuggestions("to"));
//     }
//   };

//   const handleFromChange = (event, newValue) => {
//     if (newValue) {
//       setFromCity({ value: newValue, label: newValue.city_name });
//     } else {
//       setFromCity(null);
//     }
//     dispatch(clearSuggestions("from"));
//   };

//   const handleToChange = (event, newValue) => {
//     if (newValue) {
//       setToCity({ value: newValue, label: newValue.city_name });
//     } else {
//       setToCity(null);
//     }
//     dispatch(clearSuggestions("to"));
//   };

//   const handleSwapCities = () => {
//     const temp = fromCity;
//     setFromCity(toCity);
//     setToCity(temp);
//   };

//   const toggleDay = (dayId) => {
//     if (selectedDays.includes(dayId)) {
//       setSelectedDays(selectedDays.filter((id) => id !== dayId));
//     } else {
//       setSelectedDays([...selectedDays, dayId]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Frontend validations
//     if (!fromCity || !toCity) {
//       toast.error("Please select both source and destination cities.");
//       return;
//     }

//     if (fromCity.value.city_name === toCity.value.city_name) {
//       toast.error("Source and destination cities cannot be the same.");
//       return;
//     }

//     if (!date || !time) {
//       toast.error("Please select date and time.");
//       return;
//     }

//     if (isDaily && selectedDays.length === 0) {
//       toast.error("Please select at least one day for daily rides.");
//       return;
//     }
//     //
//     if (isDaily) {
//       const ridingDay = new Date(date).getDay(); // get day index (0–6)
//       if (!selectedDays.includes(ridingDay)) {
//         const fullDay = idToDayName[ridingDay];
//         toast.error(
//           `Selected date is on a ${fullDay}, but it's not included in selected days.`
//         );
//         return;
//       }
//     }

//     //

//     // Prepare payload
//     const rideDetails = {
//       source: fromCity.value.city_name,
//       destination: toCity.value.city_name,
//       riding_date: date,
//       riding_time: time,
//       seat: seats.value,
//       vehicle_no: vehicleNumber,
//       vehicle_name: vehicleName,
//       price,
//       pick_up_location: pickupPoint,
//       drop_location: dropPoint,
//       remark: remarks,
//       status: rideShareEnabled ? 1 : 0,
//       is_daily: isDaily ? 1 : 0,
//       // selected_days: isDaily ? selectedDays.join(",") : "",
//       day: isDaily ? selectedDays.map((id) => idToDayName[id]) : [],
//     };

//     try {
//       // Dispatch API call
//       await dispatch(publishRide(rideDetails)).unwrap();

//       toast.success("Ride published successfully!");

//       // Reset form only on success
//       dispatch(resetForm());
//       setFromCity(null);
//       setToCity(null);
//       setDate("");
//       setTime("");
//       setSeats(seatOptions[0]);
//       setVehicleNumber("");
//       setVehicleName("");
//       setPrice("");
//       setRideShareEnabled(true);
//       setRemarks("");
//       setPickupPoint("");
//       setDropPoint("");
//       setIsDaily(false);
//       setSelectedDays([]);

//       navigate("/dashboard/myrides");
//     } catch (error) {
//       console.error("Publish ride failed:", error);
//       if (error?.data && typeof error.data === "object") {
//         Object.entries(error.data).forEach(([field, messages]) => {
//           if (Array.isArray(messages)) {
//             messages.forEach((msg) => toast.error(`${field}: ${msg}`));
//           }
//         });
//       } else {
//         toast.error("Failed to publish ride. Please try again.");
//       }
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-4 mt-4 mb-12"
//     >
//       <h2 className="text-3xl font-semibold text-blue-600 mb-8 text-center tracking-wide">
//         Publish Your Ride
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-7">
//         {/* From & To Cities */}
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
//           <div className="md:col-span-5 relative">
//             <label
//               htmlFor="fromCity"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Source
//             </label>
//             <div className="relative">
//               <MdLocationOn
//                 size={22}
//                 className="absolute left-3 top-4 text-blue-400 z-10 pointer-events-none"
//               />
//               <Autocomplete
//                 id="fromCity"
//                 freeSolo
//                 disableClearable
//                 options={suggestions.from?.data || []}
//                 getOptionLabel={(option) => option.city_name || ""}
//                 value={fromCity?.value || null}
//                 onChange={handleFromChange}
//                 onInputChange={handleFromInputChange}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Select source city"
//                     InputProps={{
//                       ...params.InputProps,
//                       startAdornment: (
//                         <>
//                           <span className="w-0 opacity-0">
//                             <MdLocationOn size={22} />
//                           </span>
//                           {params.InputProps.startAdornment}
//                         </>
//                       ),
//                       style: {
//                         paddingLeft: "40px",
//                         height: "50px",
//                         borderRadius: "10px",
//                       },
//                     }}
//                   />
//                 )}
//                 filterOptions={(options, state) => {
//                   const inputValue = state.inputValue.toLowerCase();
//                   const exactMatch = options.find(
//                     (option) => option.city_name.toLowerCase() === inputValue
//                   );

//                   if (exactMatch && inputValue.length > 1) {
//                     setTimeout(() => {
//                       handleFromChange(null, exactMatch);
//                     }, 0);
//                   }

//                   return options.filter((option) =>
//                     option.city_name.toLowerCase().includes(inputValue)
//                   );
//                 }}
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2 flex justify-center mb-3">
//             <Button
//               type="button"
//               onClick={handleSwapCities}
//               aria-label="Swap locations"
//               className="p-3 min-w-0 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md transition"
//             >
//               <MdSwapHoriz size={28} />
//             </Button>
//           </div>

//           <div className="md:col-span-5 relative">
//             <label
//               htmlFor="toCity"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Destination
//             </label>
//             <div className="relative">
//               <MdLocationOn
//                 size={22}
//                 className="absolute left-3 top-4 text-red-400 z-10 pointer-events-none"
//               />
//               <Autocomplete
//                 id="toCity"
//                 freeSolo
//                 disableClearable
//                 options={suggestions.to?.data || []}
//                 getOptionLabel={(option) => option.city_name || ""}
//                 value={toCity?.value || null}
//                 onChange={handleToChange}
//                 onInputChange={handleToInputChange}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Select destination city"
//                     InputProps={{
//                       ...params.InputProps,
//                       startAdornment: (
//                         <>
//                           <span className="w-0 opacity-0">
//                             <MdLocationOn size={22} />
//                           </span>
//                           {params.InputProps.startAdornment}
//                         </>
//                       ),
//                       style: {
//                         paddingLeft: "40px",
//                         height: "50px",
//                         borderRadius: "10px",
//                       },
//                     }}
//                   />
//                 )}
//                 filterOptions={(options, state) => {
//                   const inputValue = state.inputValue.toLowerCase();
//                   const exactMatch = options.find(
//                     (option) => option.city_name.toLowerCase() === inputValue
//                   );

//                   if (exactMatch && inputValue.length > 1) {
//                     setTimeout(() => {
//                       handleToChange(null, exactMatch);
//                     }, 0);
//                   }

//                   return options.filter((option) =>
//                     option.city_name.toLowerCase().includes(inputValue)
//                   );
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Date & Time */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative">
//             <label
//               htmlFor="date"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Date
//             </label>
//             <div className="relative">
//               <MdCalendarToday
//                 size={22}
//                 className="absolute left-3 top-4 text-blue-400 pointer-events-none"
//               />
//               <input
//                 type="date"
//                 id="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full h-14 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 required
//               />
//             </div>
//           </div>

//           <div className="relative">
//             <label
//               htmlFor="time"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Time
//             </label>
//             <div className="relative">
//               <MdAccessTime
//                 size={22}
//                 className="absolute left-3 top-4 text-blue-400 pointer-events-none"
//               />
//               <input
//                 type="time"
//                 id="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="w-full h-14 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         {/* Daily Ride Toggle */}
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center">
//               <MdRepeat className="text-blue-500 mr-2" size={20} />
//               <span className="font-medium text-gray-700">Daily Ride</span>
//             </div>
//             <Switch
//               checked={isDaily}
//               onChange={(e) => setIsDaily(e.target.checked)}
//               color="primary"
//             />
//           </div>

//           {isDaily && (
//             <div className="mt-4">
//               <p className="text-sm text-gray-600 mb-3">
//                 Select days for this ride:
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {weekdays.map((day) => (
//                   <Chip
//                     key={day.id}
//                     label={day.label}
//                     title={day.full}
//                     onClick={() => toggleDay(day.id)}
//                     variant={
//                       selectedDays.includes(day.id) ? "filled" : "outlined"
//                     }
//                     color={
//                       selectedDays.includes(day.id) ? "primary" : "default"
//                     }
//                     sx={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: "50%",
//                       fontWeight: "bold",
//                       fontSize: "0.875rem",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Seats, Vehicle No, Vehicle Name, Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="relative">
//             <label className="block mb-2 text-gray-700 font-medium">
//               Available Seats
//             </label>
//             <div className="relative">
//               <MdPeople
//                 size={22}
//                 className="absolute left-3 top-4 text-blue-400 pointer-events-none"
//               />
//               <Autocomplete
//                 options={seatOptions}
//                 value={seats}
//                 onChange={(e, newValue) => setSeats(newValue)}
//                 getOptionLabel={(option) => option.label}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     InputProps={{
//                       ...params.InputProps,
//                       style: {
//                         paddingLeft: "40px",
//                         height: "50px",
//                         borderRadius: "10px",
//                       },
//                     }}
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="vehicleNumber"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Vehicle Number
//             </label>
//             <TextField
//               type="text"
//               id="vehicleNumber"
//               value={vehicleNumber}
//               onChange={(e) => setVehicleNumber(e.target.value)}
//               placeholder="Enter vehicle number"
//               fullWidth
//               required
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   height: "50px",
//                   borderRadius: "10px",
//                 },
//               }}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="vehicleName"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Vehicle Name
//             </label>
//             <TextField
//               type="text"
//               id="vehicleName"
//               value={vehicleName}
//               required
//               onChange={(e) => setVehicleName(e.target.value)}
//               placeholder="Enter vehicle name"
//               fullWidth
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   height: "50px",
//                   borderRadius: "10px",
//                 },
//               }}
//             />
//           </div>

//           <div className="relative">
//             <label
//               htmlFor="price"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Price per seat (₹)
//             </label>
//             <div className="relative">
//               <TextField
//                 type="number"
//                 id="price"
//                 required
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 placeholder="Enter price"
//                 fullWidth
//                 size="small"
//                 InputProps={{}}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     height: "50px",
//                     borderRadius: "10px",
//                     pl: "10px",
//                   },
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Pickup and Drop Locations */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label
//               htmlFor="pickupPoint"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Pickup Location
//             </label>
//             <TextField
//               id="pickupPoint"
//               value={pickupPoint}
//               onChange={(e) => setPickupPoint(e.target.value)}
//               placeholder="Enter pickup location"
//               fullWidth
//               required
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   height: "50px",
//                   borderRadius: "10px",
//                 },
//               }}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="dropPoint"
//               className="block mb-2 text-gray-700 font-medium"
//             >
//               Drop Location
//             </label>
//             <TextField
//               id="dropPoint"
//               value={dropPoint}
//               onChange={(e) => setDropPoint(e.target.value)}
//               placeholder="Enter drop location"
//               fullWidth
//               required
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   height: "50px",
//                   borderRadius: "10px",
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* Remarks */}
//         <div>
//           <label
//             htmlFor="remarks"
//             className="block mb-2 text-gray-700 font-medium"
//           >
//             Remarks
//           </label>
//           <TextField
//             id="remarks"
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             placeholder="Any additional info..."
//             multiline
//             rows={3}
//             required
//             fullWidth
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "10px",
//               },
//             }}
//           />
//         </div>

//         {/* Ride Share Toggle */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             id="rideShareEnabled"
//             checked={rideShareEnabled}
//             onChange={(e) => setRideShareEnabled(e.target.checked)}
//             className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//           />
//           <label
//             htmlFor="rideShareEnabled"
//             className="text-gray-700 font-medium"
//           >
//             Enable Ride Sharing
//           </label>
//         </div>

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={loading}
//           fullWidth
//           sx={{
//             py: 2,
//             borderRadius: "12px",
//             fontSize: "1rem",
//             fontWeight: "600",
//             textTransform: "none",
//             bgcolor: loading ? "#60a5fa" : "#3b82f6",
//             "&:hover": {
//               bgcolor: "#2563eb",
//             },
//           }}
//         >
//           {loading ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//               Publishing...
//             </>
//           ) : (
//             "Publish Ride"
//           )}
//         </Button>
//       </form>
//     </motion.div>
//   );
// };

// export default PublishForm;
import React, { useState } from "react";
import { Autocomplete, TextField, Button, Chip, Switch } from "@mui/material";
import {
  MdLocationOn,
  MdSwapHoriz,
  MdCalendarToday,
  MdAccessTime,
  MdPeople,
  MdRepeat,
} from "react-icons/md";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { publishRide } from "../redux/features/publishForm";
import {
  fetchSuggestion,
  clearSuggestions,
} from "../redux/features/suggestionSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const seatOptions = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} seat${i > 0 ? "s" : ""}`,
}));

const weekdays = [
  { id: 0, label: "S", full: "Sunday" },
  { id: 1, label: "M", full: "Monday" },
  { id: 2, label: "T", full: "Tuesday" },
  { id: 3, label: "W", full: "Wednesday" },
  { id: 4, label: "T", full: "Thursday" },
  { id: 5, label: "F", full: "Friday" },
  { id: 6, label: "S", full: "Saturday" },
];

const idToDayName = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const PublishForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestions = useSelector((state) => state.suggestion);
  const { loading } = useSelector((state) => state.publishForm);

  const [formData, setFormData] = useState({
    fromCity: null,
    toCity: null,
    pickupPoint: "",
    dropPoint: "",
    date: "",
    time: "",
    seats: seatOptions[0],
    vehicleNumber: "",
    vehicleName: "",
    price: "",
    rideShareEnabled: true,
    remarks: "",
    isDaily: false,
    selectedDays: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFromInputChange = (event, value, reason) => {
    if (reason === "input" && value.length > 1) {
      dispatch(fetchSuggestion({ input: value, field: "from" }));
    } else if (reason === "clear") {
      dispatch(clearSuggestions("from"));
    }
  };

  const handleToInputChange = (event, value, reason) => {
    if (reason === "input" && value.length > 1) {
      dispatch(fetchSuggestion({ input: value, field: "to" }));
    } else if (reason === "clear") {
      dispatch(clearSuggestions("to"));
    }
  };

  const handleFromChange = (event, newValue) => {
    if (newValue) {
      handleInputChange("fromCity", {
        value: newValue,
        label: newValue.city_name,
      });
    } else {
      handleInputChange("fromCity", null);
    }
    dispatch(clearSuggestions("from"));
  };

  const handleToChange = (event, newValue) => {
    if (newValue) {
      handleInputChange("toCity", {
        value: newValue,
        label: newValue.city_name,
      });
    } else {
      handleInputChange("toCity", null);
    }
    dispatch(clearSuggestions("to"));
  };

  const handleSwapCities = () => {
    setFormData((prev) => ({
      ...prev,
      fromCity: prev.toCity,
      toCity: prev.fromCity,
    }));
  };

  const toggleDay = (dayId) => {
    setFormData((prev) => {
      const newSelectedDays = prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter((id) => id !== dayId)
        : [...prev.selectedDays, dayId];
      return { ...prev, selectedDays: newSelectedDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!formData.fromCity || !formData.toCity) {
      toast.error("Please select both source and destination cities.");
      return;
    }

    if (formData.fromCity.value.city_name === formData.toCity.value.city_name) {
      toast.error("Source and destination cities cannot be the same.");
      return;
    }

    if (!formData.date || !formData.time) {
      toast.error("Please select date and time.");
      return;
    }

    if (formData.isDaily && formData.selectedDays.length === 0) {
      toast.error("Please select at least one day for daily rides.");
      return;
    }

    if (formData.isDaily) {
      const ridingDay = new Date(formData.date).getDay();
      if (!formData.selectedDays.includes(ridingDay)) {
        const fullDay = idToDayName[ridingDay];
        toast.error(
          `Selected date is on a ${fullDay}, but it's not included in selected days.`
        );
        return;
      }
    }

    // Prepare payload
    const rideDetails = {
      source: formData.fromCity.value.city_name,
      destination: formData.toCity.value.city_name,
      riding_date: formData.date,
      riding_time: formData.time,
      seat: formData.seats.value,
      vehicle_no: formData.vehicleNumber,
      vehicle_name: formData.vehicleName,
      price: formData.price,
      pick_up_location: formData.pickupPoint,
      drop_location: formData.dropPoint,
      remark: formData.remarks,
      status: formData.rideShareEnabled ? 1 : 0,
      daily: formData.isDaily ? 1 : 0,
      day: formData.isDaily
        ? formData.selectedDays.map((id) => idToDayName[id])
        : [],
    };

    try {
      await dispatch(publishRide(rideDetails)).unwrap();
      toast.success("Ride published successfully!");
      navigate("/dashboard/myrides");
    } catch (error) {
      console.error("Publish ride failed:", error);
      if (error?.data && typeof error.data === "object") {
        Object.entries(error.data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(`${field}: ${msg}`));
          }
        });
      } else {
        toast.error("Failed to publish ride. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-4 mt-4 mb-12"
    >
      <h2 className="text-3xl font-semibold text-blue-600 mb-8 text-center tracking-wide">
        Publish Your Ride
      </h2>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* From & To Cities */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5 relative">
            <label
              htmlFor="fromCity"
              className="block mb-2 text-gray-700 font-medium"
            >
              Source
            </label>
            <div className="relative">
              <MdLocationOn
                size={22}
                className="absolute left-3 top-4 text-blue-400 z-10 pointer-events-none"
              />
              <Autocomplete
                id="fromCity"
                freeSolo
                disableClearable
                options={suggestions.from?.data || []}
                getOptionLabel={(option) => option.city_name || ""}
                value={formData.fromCity?.value || null}
                onChange={handleFromChange}
                onInputChange={handleFromInputChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select source city"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <span className="w-0 opacity-0">
                            <MdLocationOn size={22} />
                          </span>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      style: {
                        paddingLeft: "40px",
                        height: "50px",
                        borderRadius: "10px",
                      },
                    }}
                  />
                )}
                filterOptions={(options, state) => {
                  const inputValue = state.inputValue.toLowerCase();
                  const exactMatch = options.find(
                    (option) => option.city_name.toLowerCase() === inputValue
                  );

                  if (exactMatch && inputValue.length > 1) {
                    setTimeout(() => {
                      handleFromChange(null, exactMatch);
                    }, 0);
                  }

                  return options.filter((option) =>
                    option.city_name.toLowerCase().includes(inputValue)
                  );
                }}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center mb-3">
            <Button
              type="button"
              onClick={handleSwapCities}
              aria-label="Swap locations"
              className="p-3 min-w-0 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md transition"
            >
              <MdSwapHoriz size={28} />
            </Button>
          </div>

          <div className="md:col-span-5 relative">
            <label
              htmlFor="toCity"
              className="block mb-2 text-gray-700 font-medium"
            >
              Destination
            </label>
            <div className="relative">
              <MdLocationOn
                size={22}
                className="absolute left-3 top-4 text-red-400 z-10 pointer-events-none"
              />
              <Autocomplete
                id="toCity"
                freeSolo
                disableClearable
                options={suggestions.to?.data || []}
                getOptionLabel={(option) => option.city_name || ""}
                value={formData.toCity?.value || null}
                onChange={handleToChange}
                onInputChange={handleToInputChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select destination city"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <span className="w-0 opacity-0">
                            <MdLocationOn size={22} />
                          </span>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      style: {
                        paddingLeft: "40px",
                        height: "50px",
                        borderRadius: "10px",
                      },
                    }}
                  />
                )}
                filterOptions={(options, state) => {
                  const inputValue = state.inputValue.toLowerCase();
                  const exactMatch = options.find(
                    (option) => option.city_name.toLowerCase() === inputValue
                  );

                  if (exactMatch && inputValue.length > 1) {
                    setTimeout(() => {
                      handleToChange(null, exactMatch);
                    }, 0);
                  }

                  return options.filter((option) =>
                    option.city_name.toLowerCase().includes(inputValue)
                  );
                }}
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label
              htmlFor="date"
              className="block mb-2 text-gray-700 font-medium"
            >
              Date
            </label>
            <div className="relative">
              <MdCalendarToday
                size={22}
                className="absolute left-3 top-4 text-blue-400 pointer-events-none"
              />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full h-14 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="time"
              className="block mb-2 text-gray-700 font-medium"
            >
              Time
            </label>
            <div className="relative">
              <MdAccessTime
                size={22}
                className="absolute left-3 top-4 text-blue-400 pointer-events-none"
              />
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="w-full h-14 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Daily Ride Toggle */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <MdRepeat className="text-blue-500 mr-2" size={20} />
              <span className="font-medium text-gray-700">Daily Ride</span>
            </div>
            <Switch
              checked={formData.isDaily}
              onChange={(e) => handleInputChange("isDaily", e.target.checked)}
              color="primary"
            />
          </div>

          {formData.isDaily && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                Select days for this ride:
              </p>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <Chip
                    key={day.id}
                    label={day.label}
                    title={day.full}
                    onClick={() => toggleDay(day.id)}
                    variant={
                      formData.selectedDays.includes(day.id)
                        ? "filled"
                        : "outlined"
                    }
                    color={
                      formData.selectedDays.includes(day.id)
                        ? "primary"
                        : "default"
                    }
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Seats, Vehicle No, Vehicle Name, Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block mb-2 text-gray-700 font-medium">
              Available Seats
            </label>
            <div className="relative">
              <MdPeople
                size={22}
                className="absolute left-3 top-4 text-blue-400 pointer-events-none"
              />
              <Autocomplete
                options={seatOptions}
                value={formData.seats}
                onChange={(e, newValue) => handleInputChange("seats", newValue)}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        paddingLeft: "40px",
                        height: "50px",
                        borderRadius: "10px",
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="vehicleNumber"
              className="block mb-2 text-gray-700 font-medium"
            >
              Vehicle Number
            </label>
            <TextField
              type="text"
              id="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={(e) =>
                handleInputChange("vehicleNumber", e.target.value)
              }
              placeholder="Enter vehicle number"
              fullWidth
              required
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  borderRadius: "10px",
                },
              }}
            />
          </div>

          <div>
            <label
              htmlFor="vehicleName"
              className="block mb-2 text-gray-700 font-medium"
            >
              Vehicle Name
            </label>
            <TextField
              type="text"
              id="vehicleName"
              value={formData.vehicleName}
              required
              onChange={(e) => handleInputChange("vehicleName", e.target.value)}
              placeholder="Enter vehicle name"
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  borderRadius: "10px",
                },
              }}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="price"
              className="block mb-2 text-gray-700 font-medium"
            >
              Price per seat (₹)
            </label>
            <div className="relative">
              <TextField
                type="number"
                id="price"
                required
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Enter price"
                fullWidth
                size="small"
                InputProps={{}}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "50px",
                    borderRadius: "10px",
                    pl: "10px",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Pickup and Drop Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="pickupPoint"
              className="block mb-2 text-gray-700 font-medium"
            >
              Pickup Location
            </label>
            <TextField
              id="pickupPoint"
              value={formData.pickupPoint}
              onChange={(e) => handleInputChange("pickupPoint", e.target.value)}
              placeholder="Enter pickup location"
              fullWidth
              required
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  borderRadius: "10px",
                },
              }}
            />
          </div>

          <div>
            <label
              htmlFor="dropPoint"
              className="block mb-2 text-gray-700 font-medium"
            >
              Drop Location
            </label>
            <TextField
              id="dropPoint"
              value={formData.dropPoint}
              onChange={(e) => handleInputChange("dropPoint", e.target.value)}
              placeholder="Enter drop location"
              fullWidth
              required
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  borderRadius: "10px",
                },
              }}
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label
            htmlFor="remarks"
            className="block mb-2 text-gray-700 font-medium"
          >
            Remarks
          </label>
          <TextField
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange("remarks", e.target.value)}
            placeholder="Any additional info..."
            multiline
            rows={3}
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
        </div>

        {/* Ride Share Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="rideShareEnabled"
            checked={formData.rideShareEnabled}
            onChange={(e) =>
              handleInputChange("rideShareEnabled", e.target.checked)
            }
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="rideShareEnabled"
            className="text-gray-700 font-medium"
          >
            Enable Ride Sharing
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{
            py: 2,
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            textTransform: "none",
            bgcolor: loading ? "#60a5fa" : "#3b82f6",
            "&:hover": {
              bgcolor: "#2563eb",
            },
          }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Publishing...
            </>
          ) : (
            "Publish Ride"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default PublishForm;
