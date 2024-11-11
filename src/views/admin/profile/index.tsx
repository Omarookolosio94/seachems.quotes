import React, { useState, useEffect } from "react";
import Card from "core/components/card";
import avatar from "assets/img/avatars/avatar4.png";
import { MdVerifiedUser } from "react-icons/md";
import { BsFillPatchMinusFill } from "react-icons/bs";
import Button from "core/components/button/Button";
import { AiFillEdit } from "react-icons/ai";
import Modal from "core/components/modal/Modal";
import InputField from "core/components/fields/InputField";
import { useBusinessStore } from "core/services/stores/useBusinessStore";

const Profile = () => {
  const errors = useBusinessStore((state) => state.errors);
  const updateError = useBusinessStore((state) => state.updateError);
  const user = useBusinessStore((state) => state.profile);
  const updateProfileAction = useBusinessStore((state) => state.updateProfile);
  const getProfile = useBusinessStore((state) => state.getProfile);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [profile, setProfile] = useState<UpdateProfileRequest>({
    name: "",
    address: "",
    mailingAccount: "",
    mailingPassword: "",
    phoneNumber: "",
    websiteUrl: "",
  });

  const handleProfileChange = (e: any) => {
    const { name, value } = e?.target;

    setProfile((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const updateProfile = async (e: any) => {
    e.preventDefault();
    await updateProfileAction(profile);
  };

  useEffect(() => {
    user == null && getProfile();
  }, []);

  return (
    <div className="ml-4 mt-3">
      <div className="flex flex-col gap-3 pb-6 md:flex-row">
        <Card extra={"w-full md:w-2/5 h-full p-6 sm:overflow-x-auto"}>
          <div className="flex h-[250px] flex-col items-center gap-1">
            <div className="relative h-[200px] w-[200px] rounded-full">
              <img
                src={avatar}
                alt="user"
                className="h-[200px] w-[200px] rounded-full"
              />

              {user?.isVerified ? (
                <MdVerifiedUser className="absolute right-0 top-0 z-40 h-[20px] w-[20px] text-green-500" />
              ) : (
                <BsFillPatchMinusFill className="absolute right-0 top-0 z-40 h-[20px] w-[20px] text-gray-500" />
              )}
            </div>
            <p>{user?.name}</p>
          </div>
        </Card>
        <Card extra={"w-full md:w-3/5 h-full p-6 sm:overflow-x-auto"}>
          <div className="relative h-[250px]">
            <div className="mb-3">
              <span className="text-gray-500">Name: </span>
              <span>{user?.name}</span>
            </div>

            <div className="mb-3">
              <span className="text-gray-500">Email: </span>
              <span>{user?.email}</span>
            </div>

            <div className="mb-3">
              <span className="text-gray-500">Business Address: </span>
              <span>{user?.address || "n/a"}</span>
            </div>

            <div className="mb-3">
              <span className="text-gray-500">Contact Line: </span>
              <span>{user?.phoneNumber || "n/a"}</span>
            </div>

            <div className="mb-3">
              <span className="text-gray-500">Mailing Account: </span>
              <span>{user?.mailingAccount || "n/a"}</span>
            </div>

            <div className="mb-3">
              <span className="text-gray-500">Mailing Password: </span>
              <span>{user?.mailingPassword || "n/a"}</span>
            </div>

            <div className="mb-3">
              <span className="text-gray-500">Website: </span>
              <a
                className="text-brand inline-block underline"
                href={user?.websiteUrl}
                referrerPolicy="no-referrer"
                target="_blank"
              >
                {user?.websiteUrl || "n/a"}
              </a>
            </div>

            <div className="absolute bottom-0 flex w-full justify-end gap-3">
              <Button
                style={`flex gap-1 justify-items-center items-center bg-yellow-500 hover:bg-yellow-600 dark:text-white-300`}
                onClick={() => {
                  setOpenEditModal(true);
                  setProfile((state) => ({
                    ...state,
                    ...user,
                    logo: [],
                  }));
                }}
              >
                <AiFillEdit />
                <span className="text-xs">Edit</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {openEditModal && (
        <Modal
          styling="w-3/6 p-5"
          onClose={() => {
            setOpenEditModal(false);
          }}
        >
          <form onSubmit={(e) => updateProfile(e)}>
            <p className="text-black mb-5 font-bold">Update Profile</p>

            <InputField
              label="Name*"
              id="name"
              type="text"
              name="name"
              value={profile?.name}
              onChange={handleProfileChange}
              onFocus={() => {
                if (errors?.name && errors?.name?.length > 0) {
                  updateError("name");
                }
              }}
              error={errors?.name}
            />

            <InputField
              label="Business Address"
              id="address"
              type="text"
              name="address"
              value={profile?.address}
              onChange={handleProfileChange}
            />

            <InputField
              label="Contact Line"
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={profile?.phoneNumber}
              onChange={handleProfileChange}
              onFocus={() => {
                if (errors?.phoneNumber && errors?.phoneNumber?.length > 0) {
                  updateError("phoneNumber");
                }
              }}
              error={errors?.phoneNumber}
            />

            <InputField
              label="Website"
              id="websiteUrl"
              type="text"
              name="websiteUrl"
              value={profile?.websiteUrl}
              onChange={handleProfileChange}
              onFocus={() => {
                if (errors?.websiteUrl && errors?.websiteUrl?.length > 0) {
                  updateError("websiteUrl");
                }
              }}
              error={errors?.websiteUrl}
            />

            <InputField
              label="Mailing Account"
              id="mailingAccount"
              name="mailingAccount"
              type="email"
              value={profile?.mailingAccount}
              onChange={handleProfileChange}
              onFocus={() => {
                if (
                  errors?.mailingAccount &&
                  errors?.mailingAccount?.length > 0
                ) {
                  updateError("mailingAccount");
                }
              }}
              error={errors?.mailingAccount}
            />

            <InputField
              label="Mailing Password"
              id="mailingPassword"
              type="password"
              name="mailingPassword"
              value={profile?.mailingPassword}
              onChange={handleProfileChange}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setOpenEditModal(false);
                }}
                style={`linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs`}
              >
                Cancel
              </Button>
              <button
                className={`linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base text-xs font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200`}
              >
                Edit Profile
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
