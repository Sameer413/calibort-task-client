"use client";
import ImageInput from "@/components/ImageInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hook";
import {
  useDeleteByIdMutation,
  useGetUserByIdQuery,
  useLazySignOutQuery,
  useUpdateUserMutation,
} from "@/store/features/authApi";
import { login } from "@/store/features/userSlice";
import { Loader, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  image_url?: string;
};

const ProfilePage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>();

  const { data, isLoading } = useGetUserByIdQuery({});
  const [deleteHandler, { isLoading: deleteLoading }] = useDeleteByIdMutation();
  const [handleSignOut] = useLazySignOutQuery();
  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setImage(data.user.image_url);
      dispatch(login({ user: data.user, isAuthenticated: true }));
    }
  }, [data]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleDeleteUser = async () => {
    const { data } = await deleteHandler({});

    if (data.success) {
      return router.replace("/sign-up");
    }
  };

  const signOutHandler = async () => {
    const { data } = await handleSignOut({});

    if (data.success) {
      router.replace("/login");
    }
  };

  const updateUserHandler = async () => {
    if (!user?.email || !user?.name) {
      alert("Please enter email or name");
      return;
    }

    updateUser({
      email: user?.email,
      full_name: user?.name,
    });
  };

  return (
    <div className="h-full relative">
      {showModal && <ImageInput setShowModal={setShowModal} />}
      {isLoading ? (
        <div className="h-full items-center flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="w-1/3 mx-auto mt-12 flex flex-col items-center">
          <div className="text-center font-semibold text-2xl">
            Profile Settings
          </div>

          <div className="h-36 my-6" onClick={() => setShowModal(true)}>
            {user?.image_url ? (
              <Image
                src={image!}
                alt="user image"
                className="my-4"
                width={150}
                height={150}
              />
            ) : (
              <User className="h-full w-full rounded-full bg-neutral-400 p-2" />
            )}
          </div>

          <form className="flex flex-col gap-3 w-full">
            <Input
              placeholder="Full Name"
              value={user?.name ?? ""}
              onChange={(e) =>
                user && setUser({ ...user, name: e.target.value })
              }
              type="text"
              aria-label="Full Name"
            />
            <Input
              placeholder="Email address"
              value={user?.email ?? ""}
              type="text"
              onChange={(e) =>
                user && setUser({ ...user, email: e.target.value })
              }
              aria-label="Email address"
            />

            <Button
              type="submit"
              className="mt-6 cursor-pointer"
              onClick={updateUserHandler}
              disabled={updateUserLoading}
            >
              Save
            </Button>

            <Button
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="mt-2 cursor-pointer"
              variant={"destructive"}
            >
              Delete Account
            </Button>

            <Button onClick={signOutHandler}>Sign Out</Button>

            <Button variant={"link"}>
              <Link href={"/"}>Go to home</Link>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
