import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import router from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { Toast } from "primereact/toast";

export default function EmailVerification() {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/expressapi/verifyemail", values);

      toast.current.show({
        severity: "info",
        detail: data.message,
        life: 3000,
      });

      setShowToast(true);
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: "info",
        detail: error.response.data.message,
        life: 3000,
      });
      setShowToast(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email Format").required("Required"),
    otp: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const checkStatus = () => {
    if (showToast) {
      router.push("/login");
    }
  };

  return (
    <>
      <Toast ref={toast} onHide={checkStatus} />
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-gray-200 px-6 py-14 rounded shadow-md text-black w-full">
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src="https://veneratesolutions.com/wp-content/uploads/2021/03/Venerate-Medium-768x208.png"
                  width="140"
                />
                {/* <Typography.Title level={3}>Welcome to Supabase Auth</Typography.Title> */}
              </div>
              <h1 className="mb-8 text-3xl text-center">Email Verification</h1>

              <input
                type="email"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}

              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="otp"
                placeholder="One Time Password"
                {...formik.getFieldProps("otp")}
              />
              {formik.touched.otp && formik.errors.otp ? (
                <div className="text-red-500">{formik.errors.otp}</div>
              ) : null}

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-gray-600 text-white hover:bg-gray-700 focus:outline-none my-1"
              >
                {loading ? <SyncOutlined spin /> : "Submit"}
              </button>

              {/* <div className="px-16 text-grey-dark mt-6">
              New User?
              <Link href="/register">
                <a className=" no-underline border-b border-blue-700 text-blue-700">
                  Register Here
                </a>
              </Link>
            </div> */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
