import { Metadata } from "next";

import { UserDetails } from "@/components/UserDetails";
import ProfileForm from "@/components/ProfileForm";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const Profile = async () => {
  return (
    <>
      <UserDetails />
      <ProfileForm />
    </>
  );
};

export default Profile;
