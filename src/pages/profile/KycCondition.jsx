import React, { useEffect } from "react";
import { fetchProfile } from "../../redux/features/profile/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Kyc from "../profile/Kyc";
import KycInfo from "../profile/KycInfo";

const KycCondition = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Show loading state while data is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Check if data exists and has non-null kyc_details
  const hasKycDetails = data?.kyc_details != null;

  console.log("KYC Details:", data?.kyc_details, "Has KYC:", hasKycDetails);

  return <div>{hasKycDetails ? <KycInfo /> : <Kyc />}</div>;
};

export default KycCondition;
