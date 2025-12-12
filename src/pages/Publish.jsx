import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PublishForm from "../components/PublishForm";
import SharezyLoader from "../components/SharezyLoader";

const Publish = () => {
  const { loading } = useSelector((state) => state.publishForm);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const showLoader = initialLoading || loading;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 relative z-30">
      {showLoader ? (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-30 flex justify-center items-center">
          <SharezyLoader />
        </div>
      ) : (
        <PublishForm />
      )}
      <br />
      <br />
      <br />
    </div>
  );
};

export default Publish;
