import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchKyc,
  submitKyc,
  updateKyc,
} from "../../redux/features/profile/kycSlice";

const Kyc = () => {
  const dispatch = useDispatch();
  const {
    data: kycData,
    loading,
    error,
    success,
  } = useSelector((state) => state.kyc);
  const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const aadharRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    aadhar_no: "",
    pancard_no: "",
    bank_acc_no: "",
    bank_acc_name: "",
    ifsc_code: "",
    upload_aadhar: null,
    upload_pancard: null,
    upload_photo: null,
  });

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "aadhar_no":
        if (!value) return "Aadhar number is required";
        if (!/^\d{12}$/.test(value)) return "Aadhar must be 12 digits";
        return "";
      case "pancard_no":
        if (!value) return "PAN number is required";
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
          return "Invalid PAN format (e.g., ABCDE1234F)";
        return "";
      case "bank_acc_no":
        if (!value) return "Account number is required";
        if (!/^\d{9,18}$/.test(value))
          return "Account number must be 9-18 digits";
        return "";
      case "bank_acc_name":
        if (!value) return "Account holder name is required";
        if (value.length < 3) return "Name too short";
        return "";
      case "ifsc_code":
        if (!value) return "IFSC code is required";
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
          return "Invalid IFSC format (e.g., ABCD0123456)";
        return "";
      case "upload_aadhar":
        if (!editMode && !value && !kycData?.upload_aadhar)
          return "Aadhar card is required";
        if (value && !value.type.match("image.*"))
          return "Only image files are allowed";
        return "";
      case "upload_pancard":
        if (!editMode && !value && !kycData?.upload_pancard)
          return "PAN card is required";
        if (value && !value.type.match("image.*"))
          return "Only image files are allowed";
        return "";
      case "upload_photo":
        if (!editMode && !value && !kycData?.upload_photo)
          return "Photo is required";
        if (value && !value.type.match("image.*"))
          return "Only image files are allowed";
        return "";
      default:
        return "";
    }
  };

  useEffect(() => {
    dispatch(fetchKyc());
  }, [dispatch]);

  useEffect(() => {
    if (kycData?.id) {
      setFormData({
        aadhar_no: kycData.aadhar_no || "",
        pancard_no: kycData.pancard_no || "",
        bank_acc_no: kycData.bank_acc_no || "",
        bank_acc_name: kycData.bank_acc_name || "",
        ifsc_code: kycData.ifsc_code || "",
        upload_aadhar: null,
        upload_pancard: null,
        upload_photo: null,
      });
      setShowForm(true);
    }
  }, [kycData]);

  useEffect(() => {
    if (editMode && aadharRef.current) {
      aadharRef.current.focus();
    }
  }, [editMode]);

  // Initialize form for new KYC when showForm is true
  useEffect(() => {
    if (showForm && !kycData?.id) {
      setFormData({
        aadhar_no: "",
        pancard_no: "",
        bank_acc_no: "",
        bank_acc_name: "",
        ifsc_code: "",
        upload_aadhar: null,
        upload_pancard: null,
        upload_photo: null,
      });
      setEditMode(true);
    }
  }, [showForm, kycData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, file) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formPayload = new FormData();
    formPayload.append("aadhar_no", formData.aadhar_no);
    formPayload.append("pancard_no", formData.pancard_no);
    formPayload.append("bank_acc_no", formData.bank_acc_no);
    formPayload.append("bank_acc_name", formData.bank_acc_name);
    formPayload.append("ifsc_code", formData.ifsc_code);
    if (formData.upload_aadhar)
      formPayload.append("upload_aadhar", formData.upload_aadhar);
    if (formData.upload_pancard)
      formPayload.append("upload_pancard", formData.upload_pancard);
    if (formData.upload_photo)
      formPayload.append("upload_photo", formData.upload_photo);

    try {
      if (kycData?.id) {
        formPayload.append("_method", "PUT");
        await dispatch(updateKyc({ id: kycData.id, formData: formPayload }));
      } else {
        await dispatch(submitKyc(formPayload));
      }

      await dispatch(fetchKyc());
      setEditMode(false);
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error("Error saving KYC:", err);
    }
  };

  if (loading && !kycData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state only if no KYC data AND form is not shown
  if (!kycData?.id && !showForm) {
    return (
      <div className="max-w-5xl mx-auto my-8 bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            KYC Verification Required
          </h3>
          <p className="mt-2 text-gray-600">
            Your KYC information has not been submitted yet. Please complete the
            KYC verification process to continue using our services.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add KYC Information
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If KYC data exists or form is shown, display the form
  return (
    <div className="max-w-5xl mx-auto my-8 bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">KYC Verification</h1>
          <p className="text-gray-500 mt-2">
            {kycData?.id
              ? "Your KYC information is verified and on file"
              : "Please complete your KYC information"}
          </p>
        </div>

        {!editMode && kycData?.id && (
          <button
            onClick={() => setEditMode(true)}
            disabled={loading}
            className="mt-4 md:mt-0 flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Information
          </button>
        )}
      </div>

      {/* Status Messages */}
      <div className="mb-8 space-y-4">
        {success && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-green-500">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your KYC information has been successfully saved!
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-500">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Identification Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                1
              </span>
              Personal Identification
            </h3>

            <div className="space-y-6">
              <TextInput
                label="Aadhar Number"
                name="aadhar_no"
                value={formData.aadhar_no}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={!editMode}
                inputRef={aadharRef}
                error={errors.aadhar_no}
                touched={touched.aadhar_no}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              />

              <FileInput
                label="Upload Aadhar Card"
                name="upload_aadhar"
                onChange={handleFileChange}
                disabled={!editMode}
                error={errors.upload_aadhar}
                touched={touched.upload_aadhar}
                existingFile={kycData?.upload_aadhar}
              />

              {kycData?.upload_aadhar && (
                <ImagePreview
                  label="Aadhar Card Preview"
                  src={`${imageUrl}/uploads/aadhar/${kycData.upload_aadhar}`}
                />
              )}

              <TextInput
                label="PAN Number"
                name="pancard_no"
                value={formData.pancard_no}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={!editMode}
                error={errors.pancard_no}
                touched={touched.pancard_no}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              />

              <FileInput
                label="Upload PAN Card"
                name="upload_pancard"
                onChange={handleFileChange}
                disabled={!editMode}
                error={errors.upload_pancard}
                touched={touched.upload_pancard}
                existingFile={kycData?.upload_pancard}
              />

              {kycData?.upload_pancard && (
                <ImagePreview
                  label="PAN Card Preview"
                  src={`${imageUrl}/uploads/pancard/${kycData.upload_pancard}`}
                />
              )}
            </div>
          </div>

          {/* Bank & Photo Section */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  2
                </span>
                Bank Details
              </h3>

              <div className="space-y-6">
                <TextInput
                  label="Account Number"
                  name="bank_acc_no"
                  value={formData.bank_acc_no}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={!editMode}
                  error={errors.bank_acc_no}
                  touched={touched.bank_acc_no}
                  icon={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  }
                />

                <TextInput
                  label="Account Holder Name"
                  name="bank_acc_name"
                  value={formData.bank_acc_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={!editMode}
                  error={errors.bank_acc_name}
                  touched={touched.bank_acc_name}
                  icon={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />

                <TextInput
                  label="IFSC Code"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={!editMode}
                  error={errors.ifsc_code}
                  touched={touched.ifsc_code}
                  icon={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  3
                </span>
                Photograph
              </h3>

              <div className="space-y-6">
                <FileInput
                  label="Upload Your Photo"
                  name="upload_photo"
                  onChange={handleFileChange}
                  disabled={!editMode}
                  error={errors.upload_photo}
                  touched={touched.upload_photo}
                  existingFile={kycData?.upload_photo}
                />

                {kycData?.upload_photo && (
                  <ImagePreview
                    label="Your Photo Preview"
                    src={`${imageUrl}/uploads/upload_photo/${kycData.upload_photo}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                if (!kycData?.id) {
                  setShowForm(false);
                }
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 font-medium rounded-lg shadow-md transition-all duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : kycData?.id ? (
                "Update KYC"
              ) : (
                "Submit KYC"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// Enhanced Text Input with Icon and Error
const TextInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  inputRef,
  error,
  touched,
  icon,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={`Enter ${label}`}
        disabled={disabled}
        ref={inputRef}
        className={`block w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 border ${
          disabled ? "bg-gray-50 text-gray-500" : "bg-white text-gray-700"
        } rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
          touched && error ? "border-red-300" : "border-gray-300"
        }`}
      />
    </div>
    {touched && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Enhanced File Input with Error
const FileInput = ({
  label,
  name,
  onChange,
  disabled,
  error,
  touched,
  existingFile,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <label
      className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer ${
        disabled
          ? "bg-gray-50 border-gray-200 text-gray-400"
          : "bg-white hover:border-blue-400 hover:bg-blue-50"
      } transition-colors duration-200 ${
        touched && error ? "border-red-300" : "border-gray-300"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          className="w-8 h-8 mb-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-center">
          <span className="font-medium text-blue-600">Click to upload</span> or
          drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
        {existingFile && !disabled && (
          <p className="text-xs text-green-600 mt-1">
            Current file: {existingFile}
          </p>
        )}
      </div>
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept="image/*"
        disabled={disabled}
        className="hidden"
      />
    </label>
    {touched && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Enhanced Image Preview
const ImagePreview = ({ label, src }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative group">
      <img
        src={src}
        alt={label}
        className="w-full h-32 object-contain border border-gray-200 rounded-lg bg-gray-50 p-2"
      />
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-lg"
      >
        <span className="bg-white p-2 rounded-full shadow-md">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </span>
      </a>
    </div>
  </div>
);

export default Kyc;
