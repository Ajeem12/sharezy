import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FaCalendarAlt, FaUser, FaSearch, FaExchangeAlt } from "react-icons/fa";
import { motion } from "framer-motion";

import {
  setFrom,
  setTo,
  setDate,
  setPassengers,
  swapLocations,
} from "../redux/features/rideFormSlice";
import { fetchSuggestion } from "../redux/features/suggestionSlice";
import SharezyLoader from "../components/SharezyLoader";
import { toast } from "sonner";
const RideForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const suggestions = useSelector((state) => state.suggestion);
  const formData = useSelector((state) => state.rideForm);
  const searchStatus = useSelector((state) => state.search.status);
  const isLoading = searchStatus === "loading";

  // Local state to track raw input text for "From" and "To"
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  // Initialize form data from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get("from");
    const to = params.get("to");
    const date = params.get("date");
    const passenger = params.get("passenger");

    if (from) {
      dispatch(setFrom({ value: { city_name: from }, label: from }));
      setFromInput(from);
    }
    if (to) {
      dispatch(setTo({ value: { city_name: to }, label: to }));
      setToInput(to);
    }
    if (date) dispatch(setDate(date));
    if (passenger) dispatch(setPassengers(Number(passenger)));

    if (!date) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      dispatch(setDate(formattedDate));
    }
  }, [location.search, dispatch]);

  // FROM handlers
  const handleFromChange = (event, newValue) => {
    if (newValue) {
      dispatch(
        setFrom({ value: newValue, label: newValue.city_name || newValue })
      );
      setFromInput(newValue.city_name || newValue);
    } else {
      dispatch(setFrom(null));
      setFromInput("");
    }
  };

  const handleFromInputChange = (event, inputValue, reason) => {
    setFromInput(inputValue);
    if (reason === "input" && inputValue.length > 1) {
      dispatch(fetchSuggestion({ input: inputValue, field: "from" }));
    }
  };

  const handleFromBlur = () => {
    if (!formData.from || formData.from.label !== fromInput) {
      const match = (suggestions.from.data || []).find((item) =>
        item.city_name.toLowerCase().startsWith(fromInput.toLowerCase())
      );
      if (match) {
        dispatch(setFrom({ value: match, label: match.city_name }));
        setFromInput(match.city_name);
      }
    }
  };

  // TO handlers
  const handleToChange = (event, newValue) => {
    if (newValue) {
      dispatch(
        setTo({ value: newValue, label: newValue.city_name || newValue })
      );
      setToInput(newValue.city_name || newValue);
    } else {
      dispatch(setTo(null));
      setToInput("");
    }
  };

  const handleToInputChange = (event, inputValue, reason) => {
    setToInput(inputValue);
    if (reason === "input" && inputValue.length > 1) {
      dispatch(fetchSuggestion({ input: inputValue, field: "to" }));
    }
  };

  const handleToBlur = () => {
    if (!formData.to || formData.to.label !== toInput) {
      const match = (suggestions.to.data || []).find((item) =>
        item.city_name.toLowerCase().startsWith(toInput.toLowerCase())
      );
      if (match) {
        dispatch(setTo({ value: match, label: match.city_name }));
        setToInput(match.city_name);
      }
    }
  };

  // Handle date and passengers inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") dispatch(setDate(value));
    else if (name === "passengers") dispatch(setPassengers(Number(value)));
  };

  const handleSwap = () => {
    dispatch(swapLocations());
    // Also swap the local input states to keep sync
    const temp = fromInput;
    setFromInput(toInput);
    setToInput(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent same city in From and To
    if (
      !formData.from ||
      !formData.to ||
      !formData.date ||
      formData.from.label.toLowerCase() === formData.to.label.toLowerCase()
    ) {
      toast.error(
        formData.from &&
          formData.to &&
          formData.from.label.toLowerCase() === formData.to.label.toLowerCase()
          ? "From and To cannot be the same city"
          : "Please select From, To locations and Date"
      );
      return;
    }

    const payload = {
      riding_date: formData.date,
      source: formData.from?.value?.city_name || "",
      destination: formData.to?.value?.city_name || "",
      passenger: formData.passengers || 1,
    };

    // Save to localStorage recent searches
    const searchHistory =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    const newSearch = {
      from: payload.source,
      to: payload.destination,
      date: payload.riding_date,
      passengers: payload.passenger,
    };
    const updatedSearches = [newSearch, ...searchHistory].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Navigate with query params
    const queryParams = new URLSearchParams({
      from: payload.source,
      to: payload.destination,
      date: payload.riding_date,
      passenger: payload.passenger.toString(),
    }).toString();

    navigate(`/rides?${queryParams}`);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
        <SharezyLoader />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 w-full backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end"
      >
        {/* From */}
        <div className="relative w-full lg:col-span-3">
          <Autocomplete
            freeSolo
            disableClearable
            options={suggestions.from.data || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.city_name || ""
            }
            value={formData.from ? formData.from.value : null}
            onChange={handleFromChange}
            onInputChange={handleFromInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                variant="outlined"
                required
                onBlur={handleFromBlur}
              />
            )}
          />
        </div>

        {/* Swap Button */}
        <motion.button
          type="button"
          onClick={handleSwap}
          whileTap={{ scale: 0.95 }}
          className="lg:col-span-1 bg-white p-2 rounded-full shadow-md border border-gray-200 self-center justify-self-center"
          aria-label="Swap locations"
        >
          <FaExchangeAlt className="text-blue-500 text-lg" />
        </motion.button>

        {/* To */}
        <div className="relative w-full lg:col-span-3">
          <Autocomplete
            freeSolo
            disableClearable
            options={suggestions.to.data || []}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.city_name || ""
            }
            value={formData.to ? formData.to.value : null}
            onChange={handleToChange}
            onInputChange={handleToInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                variant="outlined"
                required
                onBlur={handleToBlur}
              />
            )}
          />
        </div>

        {/* Date */}
        <div className="w-full lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              required
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="w-full lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passengers
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="number"
              name="passengers"
              min="1"
              max="6"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="w-full lg:col-span-2">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center w-full h-[42px]"
          >
            <FaSearch className="mr-2" />
            <span>Search Rides</span>
          </motion.button>
        </div>
      </form>
    </motion.section>
  );
};

export default RideForm;

// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import { FaCalendarAlt, FaUser, FaSearch, FaExchangeAlt } from "react-icons/fa";
// import { motion } from "framer-motion";

// import {
//   setFrom,
//   setTo,
//   setDate,
//   setPassengers,
//   swapLocations,
// } from "../redux/features/rideFormSlice";
// import {
//   fetchSuggestion,
//   clearSuggestions,
// } from "../redux/features/suggestionSlice";
// import SharezyLoader from "../components/SharezyLoader";
// import { toast } from "sonner";

// const RideForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const suggestions = useSelector((state) => state.suggestion);
//   const formData = useSelector((state) => state.rideForm);
//   const searchStatus = useSelector((state) => state.search.status);
//   const isLoading = searchStatus === "loading";

//   // Initialize form data from query params
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const from = params.get("from");
//     const to = params.get("to");
//     const date = params.get("date");
//     const passenger = params.get("passenger");

//     if (from) dispatch(setFrom({ value: { city_name: from }, label: from }));
//     if (to) dispatch(setTo({ value: { city_name: to }, label: to }));
//     if (date) dispatch(setDate(date));
//     if (passenger) dispatch(setPassengers(Number(passenger)));

//     if (!date) {
//       const today = new Date();
//       const formattedDate = today.toISOString().split("T")[0];
//       dispatch(setDate(formattedDate));
//     }
//   }, [location.search, dispatch]);

//   const handleFromChange = (event, newValue) => {
//     if (newValue) {
//       dispatch(setFrom({ value: newValue, label: newValue.city_name }));
//     } else {
//       dispatch(setFrom(null));
//     }
//   };

//   const handleFromInputChange = (event, inputValue, reason) => {
//     if (reason === "input" && inputValue.length > 1) {
//       dispatch(fetchSuggestion({ input: inputValue, field: "from" }));
//     } else if (reason === "clear") {
//       // Clear suggestions when input is cleared
//       dispatch(clearSuggestions("from"));
//     }
//   };

//   const handleToChange = (event, newValue) => {
//     if (newValue) {
//       dispatch(setTo({ value: newValue, label: newValue.city_name }));
//     } else {
//       dispatch(setTo(null));
//     }
//   };

//   const handleToInputChange = (event, inputValue, reason) => {
//     if (reason === "input" && inputValue.length > 1) {
//       dispatch(fetchSuggestion({ input: inputValue, field: "to" }));
//     } else if (reason === "clear") {
//       dispatch(clearSuggestions("to"));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "date") dispatch(setDate(value));
//     else if (name === "passengers") dispatch(setPassengers(Number(value)));
//   };

//   const handleSwap = () => {
//     dispatch(swapLocations());
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const fromCity = formData.from?.value?.city_name;
//     const toCity = formData.to?.value?.city_name;

//     if (!formData.from || !formData.to || !formData.date) {
//       toast.error("Please select From, To locations and Date");
//       return;
//     }

//     if (fromCity === toCity) {
//       toast.error("From and To cities cannot be the same.");
//       return;
//     }
//     const payload = {
//       riding_date: formData.date,
//       source: formData.from?.value?.city_name || "",
//       destination: formData.to?.value?.city_name || "",
//       passenger: formData.passengers || 1,
//     };

//     // Save to localStorage recent searches
//     const searchHistory =
//       JSON.parse(localStorage.getItem("recentSearches")) || [];
//     const newSearch = {
//       from: payload.source,
//       to: payload.destination,
//       date: payload.riding_date,
//       passengers: payload.passenger,
//     };
//     const updatedSearches = [newSearch, ...searchHistory].slice(0, 5);
//     localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

//     // Navigate with query params
//     const queryParams = new URLSearchParams({
//       from: payload.source,
//       to: payload.destination,
//       date: payload.riding_date,
//       passenger: payload.passenger.toString(),
//     }).toString();

//     navigate(`/rides?${queryParams}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
//         <SharezyLoader />
//       </div>
//     );
//   }

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-white/90 w-full backdrop-blur-md rounded-2xl p-6 border border-white/20"
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end"
//       >
//         {/* From */}
//         <div className="relative w-full lg:col-span-3">
//           {/* <Autocomplete
//             freeSolo
//             disableClearable
//             options={suggestions.from.data || []}
//             getOptionLabel={(option) =>
//               typeof option === "string"
//                 ? option
//                 : option.city_name || ""
//             }
//             value={formData.from ? formData.from.value : null}
//             onChange={handleFromChange}
//             onInputChange={handleFromInputChange}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="From"
//                 variant="outlined"
//                 required
//               />
//             )}
//           /> */}

//           <div className="relative w-full lg:col-span-3">
//             <Autocomplete
//               freeSolo
//               disableClearable
//               options={suggestions.from.data || []}
//               getOptionLabel={(option) =>
//                 typeof option === "string" ? option : option.city_name || ""
//               }
//               value={formData.from ? formData.from.value : null}
//               onChange={handleFromChange}
//               onInputChange={handleFromInputChange}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="From"
//                   variant="outlined"
//                   required
//                   onKeyDown={(e) => {
//                     if (
//                       e.key === "Enter" &&
//                       suggestions.from.data?.length > 0
//                     ) {
//                       handleFromChange(null, suggestions.from.data[0]);
//                       // Prevent form submission if we're selecting a suggestion
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </div>

//         {/* Swap Button */}
//         <motion.button
//           type="button"
//           onClick={handleSwap}
//           whileTap={{ scale: 0.95 }}
//           className="lg:col-span-1 bg-white p-2 rounded-full shadow-md border border-gray-200 self-center justify-self-center"
//           aria-label="Swap locations"
//         >
//           <FaExchangeAlt className="text-blue-500 text-lg" />
//         </motion.button>

//         {/* To */}
//         <div className="relative w-full lg:col-span-3">
//           {/* <Autocomplete
//             freeSolo
//             disableClearable
//             options={suggestions.to.data || []}
//             getOptionLabel={(option) =>
//               typeof option === "string"
//                 ? option
//                 : option.city_name || ""
//             }
//             value={formData.to ? formData.to.value : null}
//             onChange={handleToChange}
//             onInputChange={handleToInputChange}
//             renderInput={(params) => (
//               <TextField {...params} label="To" variant="outlined" required />
//             )}
//           /> */}

//           <Autocomplete
//             freeSolo
//             disableClearable
//             options={suggestions.to.data || []}
//             getOptionLabel={(option) =>
//               typeof option === "string" ? option : option.city_name || ""
//             }
//             value={formData.to ? formData.to.value : null}
//             onChange={handleToChange}
//             onInputChange={handleToInputChange}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="To"
//                 variant="outlined"
//                 required
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && suggestions.to.data?.length > 0) {
//                     handleToChange(null, suggestions.to.data[0]);
//                     // Prevent form submission if we're selecting a suggestion
//                     e.preventDefault();
//                   }
//                 }}
//               />
//             )}
//           />
//         </div>

//         {/* Date */}
//         <div className="w-full lg:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Date
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaCalendarAlt className="text-gray-400" />
//             </div>
//             <input
//               type="date"
//               name="date"
//               value={formData.date || ""}
//               onChange={handleChange}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
//               required
//             />
//           </div>
//         </div>

//         {/* Passengers */}
//         <div className="w-full lg:col-span-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Passengers
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUser className="text-gray-400" />
//             </div>
//             <input
//               type="number"
//               name="passengers"
//               min="1"
//               max="6"
//               value={formData.passengers}
//               onChange={handleChange}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
//               required
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="w-full lg:col-span-2">
//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center w-full h-[42px]"
//           >
//             <FaSearch className="mr-2" />
//             <span>Search Rides</span>
//           </motion.button>
//         </div>
//       </form>
//     </motion.section>
//   );
// };

// export default RideForm;

// // import React, { useState, useEffect } from "react";
// // import Select from "react-select";
// // import { FaCalendarAlt, FaUser, FaSearch, FaExchangeAlt } from "react-icons/fa";
// // import { motion } from "framer-motion";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   setFrom,
// //   setTo,
// //   setDate,
// //   setPassengers,
// //   swapLocations,
// // } from "../redux/features/rideFormSlice";
// // import { fetchSuggestion } from "../redux/features/suggestionSlice";
// // import { searchRides } from "../redux/features/searchSlice";
// // import SharezyLoader from "../components/SharezyLoader";

// // const RideForm = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const dispatch = useDispatch();

// //   const suggestions = useSelector((state) => state.suggestion);
// //   const formData = useSelector((state) => state.rideForm);

// //   const searchStatus = useSelector((state) => state.search.status);
// //   const isLoading = searchStatus === "loading";

// //   // Set today's date as default if no date is selected
// //   useEffect(() => {
// //     const params = new URLSearchParams(location.search);
// //     const from = params.get("from");
// //     const to = params.get("to");
// //     const date = params.get("date");
// //     const passenger = params.get("passenger");

// //     if (from) dispatch(setFrom({ value: { city_name: from }, label: from }));
// //     if (to) dispatch(setTo({ value: { city_name: to }, label: to }));
// //     if (date) dispatch(setDate(date));
// //     if (passenger) dispatch(setPassengers(Number(passenger)));

// //     if (!date) {
// //       const today = new Date();
// //       const formattedDate = today.toISOString().split("T")[0];
// //       dispatch(setDate(formattedDate));
// //     }
// //   }, [location.search, dispatch]);

// //   const [fromInput, setFromInput] = useState("");
// //   const [toInput, setToInput] = useState("");

// //   // Keep fromInput in sync with formData.from
// //   useEffect(() => {
// //     if (formData.from) {
// //       setFromInput(formData.from.label || formData.from.value.city_name || "");
// //     } else {
// //       setFromInput("");
// //     }
// //   }, [formData.from]);

// //   // Similarly for toInput syncing (optional)
// //   useEffect(() => {
// //     if (formData.to) {
// //       setToInput(formData.to.label || formData.to.value.city_name || "");
// //     } else {
// //       setToInput("");
// //     }
// //   }, [formData.to]);

// //   const handleInputChange = (inputValue, field) => {
// //     if (field === "from") {
// //       setFromInput(inputValue);
// //     } else if (field === "to") {
// //       setToInput(inputValue);
// //     }

// //     if (inputValue && inputValue.length > 1) {
// //       dispatch(fetchSuggestion({ input: inputValue, field }));
// //     }
// //   };

// //   const handleSelectChange = (selectedOption, actionMeta) => {
// //   if (actionMeta.name === "from") {
// //     dispatch(setFrom(selectedOption));
// //     setFromInput(selectedOption ? selectedOption.label : "");
// //   } else if (actionMeta.name === "to") {
// //     dispatch(setTo(selectedOption));
// //     setToInput(selectedOption ? selectedOption.label : "");
// //   }
// // };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     if (name === "date") dispatch(setDate(value));
// //     else if (name === "passengers") dispatch(setPassengers(Number(value)));
// //   };

// //   const handleSwap = () => {
// //     dispatch(swapLocations());
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     if (!formData.from || !formData.to || !formData.date) {
// //       alert("Please select From, To locations and Date");
// //       return;
// //     }

// //     const payload = {
// //       riding_date: formData.date,
// //       source: formData.from?.value?.city_name || "",
// //       destination: formData.to?.value?.city_name || "",
// //       passenger: formData.passengers || 1,
// //     };

// //     const searchHistory =
// //       JSON.parse(localStorage.getItem("recentSearches")) || [];
// //     const newSearch = {
// //       from: payload.source,
// //       to: payload.destination,
// //       date: payload.riding_date,
// //       passengers: payload.passenger,
// //     };
// //     const updatedSearches = [newSearch, ...searchHistory].slice(0, 5);
// //     localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

// //     const queryParams = new URLSearchParams({
// //       from: payload.source,
// //       to: payload.destination,
// //       date: payload.riding_date,
// //       passenger: payload.passenger.toString(),
// //     }).toString();

// //     navigate(`/rides?${queryParams}`);
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
// //         <SharezyLoader />
// //       </div>
// //     );
// //   }

// //   return (
// //     <motion.section
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.5 }}
// //       className="bg-white/90 w-full backdrop-blur-md rounded-2xl p-6 border border-white/20"
// //     >
// //       <form
// //         onSubmit={handleSubmit}
// //         className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end"
// //       >
// //         {/* From */}
// //         <div className="relative w-full lg:col-span-3">
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             From
// //           </label>
// //           <Select
// //             name="from"
// //             value={formData.from}
// //             onChange={handleSelectChange}
// //             onInputChange={(value) => handleInputChange(value, "from")}
// //             options={(suggestions.from.data || []).map((city) => ({
// //               value: city,
// //               label: city.city_name,
// //             }))}
// //             inputValue={fromInput}
// //             onBlur={() => {
// //               if (fromInput && !formData.from) {
// //                 const matchedOption = (suggestions.from.data || []).find(
// //                   (city) =>
// //                     city.city_name.toLowerCase() === fromInput.toLowerCase()
// //                 );
// //                 if (matchedOption) {
// //                   dispatch(
// //                     setFrom({ value: matchedOption, label: matchedOption.city_name })
// //                   );
// //                 } else {
// //                   dispatch(setFrom({ value: { city_name: fromInput }, label: fromInput }));
// //                 }
// //               }
// //             }}
// //             isClearable
// //             menuPortalTarget={document.body}
// //             styles={{
// //               menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// //             }}
// //           />
// //         </div>

// //         {/* Swap Button */}
// //         <motion.button
// //           type="button"
// //           onClick={handleSwap}
// //           whileTap={{ scale: 0.95 }}
// //           className="lg:col-span-1 bg-white p-2 rounded-full shadow-md border border-gray-200 self-center justify-self-center"
// //           aria-label="Swap locations"
// //         >
// //           <FaExchangeAlt className="text-blue-500 text-lg" />
// //         </motion.button>

// //         {/* To */}
// //         <div className="relative w-full lg:col-span-3">
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             To
// //           </label>
// //           <Select
// //             name="to"
// //             value={formData.to}
// //             onChange={handleSelectChange}
// //             onInputChange={(value) => handleInputChange(value, "to")}
// //             options={(suggestions.to.data || []).map((city) => ({
// //               value: city,
// //               label: city.city_name,
// //             }))}
// //             inputValue={toInput}
// //             onBlur={() => {
// //               if (toInput && !formData.to) {
// //                 const matchedOption = (suggestions.to.data || []).find(
// //                   (city) => city.city_name.toLowerCase() === toInput.toLowerCase()
// //                 );
// //                 if (matchedOption) {
// //                   dispatch(setTo({ value: matchedOption, label: matchedOption.city_name }));
// //                 } else {
// //                   dispatch(setTo({ value: { city_name: toInput }, label: toInput }));
// //                 }
// //               }
// //             }}
// //             isClearable
// //             onBlurResetsInput={false}
// //             menuPortalTarget={document.body}
// //             styles={{
// //               menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// //             }}
// //           />
// //         </div>

// //         {/* Date */}
// //         <div className="w-full lg:col-span-2">
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Date
// //           </label>
// //           <div className="relative">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <FaCalendarAlt className="text-gray-400" />
// //             </div>
// //             <input
// //               type="date"
// //               name="date"
// //               value={formData.date || ""}
// //               onChange={handleChange}
// //               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
// //               required
// //             />
// //           </div>
// //         </div>

// //         {/* Passengers */}
// //         <div className="w-full lg:col-span-1">
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Passengers
// //           </label>
// //           <div className="relative">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <FaUser className="text-gray-400" />
// //             </div>
// //             <input
// //               type="number"
// //               name="passengers"
// //               min="1"
// //               max="6"
// //               value={formData.passengers}
// //               onChange={handleChange}
// //               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
// //               required
// //             />
// //           </div>
// //         </div>

// //         {/* Submit */}
// //         <div className="w-full lg:col-span-2">
// //           <motion.button
// //             type="submit"
// //             whileHover={{ scale: 1.02 }}
// //             whileTap={{ scale: 0.98 }}
// //             className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center w-full h-[42px]"
// //           >
// //             <FaSearch className="mr-2" />
// //             <span>Search Rides</span>
// //           </motion.button>
// //         </div>
// //       </form>
// //     </motion.section>
// //   );
// // };

// // export default RideForm;
