"use client";

import { updateGuest } from "../_lib/action";
import { useFormStatus } from "react-dom";
import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ guest, children }) {
  const { fullName, email, nationality, nationalID, countryFlag } = guest;

  return (
    // we pass the data to serveraction using the native form data api
    <form
      action={updateGuest}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          name="fullName"
          defaultValue={fullName}
          disabled
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          name="email"
          disabled
          defaultValue={email}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <img
            src={countryFlag}
            alt="Country flag"
            className="h-5 rounded-sm"
          />
        </div>

        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          defaultValue={nationalID}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end  ">
        <SubmitButton pendingLabel="Updating...">UpdateProfile</SubmitButton>
      </div>
    </form>
  );
}

// function Button() {
//   const x = useFormStatus();
//   const { pending, action, formData } = x;
//   console.log(x.data);
//   console.log(x);

//   return (
//     <button
//       className="bg-accent-500 px-8
//     py-4 text-primary-800 font-semibold
//      hover:bg-accent-600
//      transition-all
//      disabled:cursor-not-allowed
//       disabled:bg-gray-500 disabled:text-gray-300"
//       disabled={pending}
//     >
//       {pending ? "Updating..." : "Update profile"}
//     </button>
//   );
// }

export default UpdateProfileForm;
