import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchKyc,
  submitKyc,
  updateKyc,
} from "../../redux/features/profile/kycSlice";

const initialForm = {
  aadhar_no: "",
  pancard_no: "",
  bank_acc_no: "",
  bank_acc_name: "",
  ifsc_code: "",
  upload_aadhar: null,
  upload_pancard: null,
  upload_photo: null,
};

const Kyc = () => {
  const dispatch = useDispatch();
  const { data: kycData, loading, error, success } = useSelector((s) => s.kyc);
  const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [previews, setPreviews] = useState({
    upload_aadhar: null,
    upload_pancard: null,
    upload_photo: null,
  });
  const [apiResponse, setApiResponse] = useState(null);
  const aadharRef = useRef(null);

  useEffect(() => {
    dispatch(fetchKyc());
  }, [dispatch]);

  useEffect(() => {
    if (kycData?.id) {
      setForm({
        aadhar_no: kycData.aadhar_no || "",
        pancard_no: kycData.pancard_no || "",
        bank_acc_no: kycData.bank_acc_no || "",
        bank_acc_name: kycData.bank_acc_name || "",
        ifsc_code: kycData.ifsc_code || "",
        upload_aadhar: null,
        upload_pancard: null,
        upload_photo: null,
      });
      setPreviews({
        upload_aadhar: null,
        upload_pancard: null,
        upload_photo: null,
      });
      setShowForm(true);
      setEditMode(false);
    } else if (!kycData?.id && showForm) {
      // new KYC
      setForm(initialForm);
      setEditMode(true);
    }
  }, [kycData, showForm]);

  useEffect(() => {
    return () => {
      // revoke object URLs
      Object.values(previews).forEach((p) => p && URL.revokeObjectURL(p));
    };
  }, [previews]);

  useEffect(() => {
    if (editMode && aadharRef.current) aadharRef.current.focus();
  }, [editMode]);

  const validators = {
    aadhar_no: (v) =>
      !v
        ? "Aadhar number is required"
        : !/^\d{12}$/.test(v)
        ? "Aadhar must be 12 digits"
        : "",
    pancard_no: (v) =>
      !v
        ? "PAN number is required"
        : !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)
        ? "Invalid PAN format (e.g., ABCDE1234F)"
        : "",
    bank_acc_no: (v) =>
      !v
        ? "Account number is required"
        : !/^\d{9,18}$/.test(v)
        ? "Account number must be 9-18 digits"
        : "",
    bank_acc_name: (v) =>
      !v
        ? "Account holder name is required"
        : v.length < 3
        ? "Name too short"
        : "",
    ifsc_code: (v) =>
      !v
        ? "IFSC code is required"
        : !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v)
        ? "Invalid IFSC format (e.g., ABCD0123456)"
        : "",
    upload_aadhar: (f) => {
      if (!editMode && !f && !kycData?.upload_aadhar)
        return "Aadhar card is required";
      if (f && !f.type.match("image.*")) return "Only image files are allowed";
      return "";
    },
    upload_pancard: (f) => {
      if (!editMode && !f && !kycData?.upload_pancard)
        return "PAN card is required";
      if (f && !f.type.match("image.*")) return "Only image files are allowed";
      return "";
    },
    upload_photo: (f) => {
      if (!editMode && !f && !kycData?.upload_photo) return "Photo is required";
      if (f && !f.type.match("image.*")) return "Only image files are allowed";
      return "";
    },
  };

  const validateField = (name, value) => {
    const fn = validators[name];
    return fn ? fn(value) : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name])
      setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    // revoke previous
    if (previews[name]) URL.revokeObjectURL(previews[name]);
    setForm((p) => ({ ...p, [name]: file }));
    setPreviews((p) => ({
      ...p,
      [name]: file ? URL.createObjectURL(file) : null,
    }));
    if (touched[name])
      setErrors((p) => ({ ...p, [name]: validateField(name, file) }));
  };

  const validateForm = () => {
    const newErr = {};
    let ok = true;
    Object.keys(form).forEach((k) => {
      const err = validateField(k, form[k]);
      if (err) ok = false;
      newErr[k] = err;
    });
    setErrors(newErr);
    setTouched(Object.keys(form).reduce((a, k) => ({ ...a, [k]: true }), {}));
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const fd = new FormData();
    fd.append("aadhar_no", form.aadhar_no);
    fd.append("pancard_no", form.pancard_no);
    fd.append("bank_acc_no", form.bank_acc_no);
    fd.append("bank_acc_name", form.bank_acc_name);
    fd.append("ifsc_code", form.ifsc_code);
    if (form.upload_aadhar) fd.append("upload_aadhar", form.upload_aadhar);
    if (form.upload_pancard) fd.append("upload_pancard", form.upload_pancard);
    if (form.upload_photo) fd.append("upload_photo", form.upload_photo);

    try {
      let res;
      if (kycData?.id) {
        fd.append("_method", "PUT");
        res = await dispatch(updateKyc({ id: kycData.id, formData: fd }));
      } else {
        res = await dispatch(submitKyc(fd));
      }
      // store API response for debug/display
      setApiResponse(JSON.stringify(res?.payload ?? res, null, 2));
      // refresh server data
      await dispatch(fetchKyc());
      setEditMode(false);
    } catch (err) {
      setApiResponse(String(err));
      console.error(err);
    }
  };

  // Simple loading / empty states kept visually similar
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
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add KYC Information
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8 bg-gradient-to-br from-white to-gray-50 p-2  mb-20">
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
            className="mt-4 md:mt-0 flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md"
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

      <div className="mb-8 space-y-4">
        {success && (
          <MessageBox type="success">
            Your KYC information has been successfully saved!
          </MessageBox>
        )}
        {error && <MessageBox type="error">{error}</MessageBox>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                1
              </span>{" "}
              Personal Identification
            </h3>
            <div className="space-y-6">
              <TextInput
                label="Aadhar Number"
                name="aadhar_no"
                value={form.aadhar_no}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!editMode}
                inputRef={aadharRef}
                error={errors.aadhar_no}
                touched={touched.aadhar_no}
              />
              <FileInput
                label="Upload Aadhar Card"
                name="upload_aadhar"
                onChange={handleFile}
                disabled={!editMode}
                error={errors.upload_aadhar}
                touched={touched.upload_aadhar}
                existingFile={kycData?.upload_aadhar}
                preview={previews.upload_aadhar}
              />
              <PreviewCard
                label="Aadhar"
                local={previews.upload_aadhar}
                server={
                  kycData?.upload_aadhar
                    ? `${imageUrl}/uploads/aadhar/${kycData.upload_aadhar}`
                    : null
                }
              />
              <TextInput
                label="PAN Number"
                name="pancard_no"
                value={form.pancard_no}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!editMode}
                error={errors.pancard_no}
                touched={touched.pancard_no}
              />
              <FileInput
                label="Upload PAN Card"
                name="upload_pancard"
                onChange={handleFile}
                disabled={!editMode}
                error={errors.upload_pancard}
                touched={touched.upload_pancard}
                existingFile={kycData?.upload_pancard}
                preview={previews.upload_pancard}
              />
              <PreviewCard
                label="PAN"
                local={previews.upload_pancard}
                server={
                  kycData?.upload_pancard
                    ? `${imageUrl}/uploads/pancard/${kycData.upload_pancard}`
                    : null
                }
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  2
                </span>{" "}
                Bank Details
              </h3>
              <div className="space-y-6">
                <TextInput
                  label="Account Number"
                  name="bank_acc_no"
                  value={form.bank_acc_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!editMode}
                  error={errors.bank_acc_no}
                  touched={touched.bank_acc_no}
                />
                <TextInput
                  label="Account Holder Name"
                  name="bank_acc_name"
                  value={form.bank_acc_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!editMode}
                  error={errors.bank_acc_name}
                  touched={touched.bank_acc_name}
                />
                <TextInput
                  label="IFSC Code"
                  name="ifsc_code"
                  value={form.ifsc_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!editMode}
                  error={errors.ifsc_code}
                  touched={touched.ifsc_code}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  3
                </span>{" "}
                Photograph
              </h3>
              <div className="space-y-6">
                <FileInput
                  label="Upload Your Photo"
                  name="upload_photo"
                  onChange={handleFile}
                  disabled={!editMode}
                  error={errors.upload_photo}
                  touched={touched.upload_photo}
                  existingFile={kycData?.upload_photo}
                  preview={previews.upload_photo}
                />
                <PreviewCard
                  label="Photo"
                  local={previews.upload_photo}
                  server={
                    kycData?.upload_photo
                      ? `${imageUrl}/uploads/upload_photo/${kycData.upload_photo}`
                      : null
                  }
                />
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
                if (!kycData?.id) setShowForm(false);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 font-medium rounded-lg shadow-md ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              }`}
            >
              {loading
                ? "Processing..."
                : kycData?.id
                ? "Update KYC"
                : "Submit KYC"}
            </button>
          </div>
        )}
      </form>

      {/* Image previews from server or local files */}
      {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <PreviewCard
          label="Aadhar"
          local={previews.upload_aadhar}
          server={
            kycData?.upload_aadhar
              ? `${imageUrl}/uploads/aadhar/${kycData.upload_aadhar}`
              : null
          }
        />
        <PreviewCard
          label="PAN"
          local={previews.upload_pancard}
          server={
            kycData?.upload_pancard
              ? `${imageUrl}/uploads/pancard/${kycData.upload_pancard}`
              : null
          }
        />
        <PreviewCard
          label="Photo"
          local={previews.upload_photo}
          server={
            kycData?.upload_photo
              ? `${imageUrl}/uploads/upload_photo/${kycData.upload_photo}`
              : null
          }
        />
      </div> */}
    </div>
  );
};

// Small helper components
const MessageBox = ({ children, type = "success" }) => (
  <div
    className={`p-4 ${
      type === "success"
        ? "bg-green-50 border-l-4 border-green-500 text-green-800"
        : "bg-red-50 border-l-4 border-red-500 text-red-800"
    } rounded-r`}
  >
    <div className="flex items-center">
      <div className="ml-3">
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  </div>
);

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
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      ref={inputRef}
      placeholder={`Enter ${label}`}
      className={`block w-full pr-4 py-3 border ${
        disabled ? "bg-gray-50 text-gray-500" : "bg-white text-gray-700"
      } rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
        touched && error ? "border-red-300" : "border-gray-300"
      }`}
    />
    {touched && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const FileInput = ({
  label,
  name,
  onChange,
  disabled,
  error,
  touched,
  existingFile,
  preview,
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
      } ${touched && error ? "border-red-300" : "border-gray-300"}`}
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
        {existingFile && !preview && (
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

const PreviewCard = ({ label, local, server }) => {
  const src = local || server;
  if (!src) return null;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} Preview
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};

export default Kyc;
