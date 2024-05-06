"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import qs from "query-string";
const SignInToast = () => {
  //Show a toast when the user successfully signs in
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  useEffect(() => {
    if (redirectedFrom?.startsWith("auth/signin")) {
      const current = qs.parse(searchParams.toString());
      const query = {
        ...current,
        redirectedFrom: null,
      };
      const newQuery = qs.stringifyUrl(
        {
          url: window.location.href,
          query,
        },
        {
          skipNull: true,
        }
      );
      router.replace(newQuery);
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    if (!showToast) return;
    toast.success("You have successfully signed in");
    setShowToast(false);
  }, [showToast]);

  return null;
};

export default SignInToast;
