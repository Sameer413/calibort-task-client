"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux-hook";
import { useLoadUserQuery } from "@/store/apiSlice";
import { useSyncThirdPartyUsersMutation } from "@/store/features/authApi";
import axios from "axios";
import { ArrowLeft, ArrowRight, Loader, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  email: string;
  first_name?: string;
  last_name: string;
  avatar: string;
  id: number;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const [handleSyncUser] = useSyncThirdPartyUsersMutation();

  const { isLoading: loadUserLoading } = useLoadUserQuery();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `https://reqres.in/api/users?page=${page}`,
          {
            headers: {
              "x-api-key": "reqres-free-v1",
            },
          }
        );

        await handleSyncUser({
          data: data.data,
        }).unwrap();

        setUsers(data?.data);
      } catch (error: unknown) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [page]);

  return loadUserLoading ? (
    <div className="h-screen flex items-center justify-center">
      <Loader className="animate-spin text-4xl" />
    </div>
  ) : (
    <div className="flex items-center justify-center relative">
      <div className="absolute right-10 top-10 flex gap-2 items-center">
        {!isAuthenticated && (
          <Link href={"/login"}>
            <Button>Sign In</Button>
          </Link>
        )}
        <Link href={"/profile"}>
          <UserRound className="p-2 cursor-pointer rounded-full bg-neutral-500 h-10 w-10" />
        </Link>
      </div>

      <div className="mt-12 ">
        <div className="text-2xl font-medium text-center mb-6">
          List of current available users
        </div>

        <div
          className="flex flex-col gap-3 h-1/3 overflow-y-auto"
          style={{ height: "70vh" }}
        >
          {loading ? (
            <Loader className="text-4xl animate-spin" />
          ) : users.length > 0 ? (
            users?.map(({ first_name, last_name, email, id, avatar }) => (
              <Link
                href={`/third-party-user-detail/${id}`}
                key={id}
                className="border-2 shadow-sm rounded-md flex gap-2 hover:shadow-md transition-shadow duration-150 ease-linear items-center"
              >
                <Image
                  src={avatar}
                  alt={`${first_name} image`}
                  width={100}
                  height={100}
                  className="rounded-l-md"
                />
                <div className="p-3">
                  <div className="text-base font-medium">
                    Full name:{" "}
                    <span className="font-normal">
                      {first_name} {last_name}
                    </span>
                  </div>
                  <div className="text-base font-medium">
                    email:
                    <span className="font-normal">{email}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="">No user available at the moment.</div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button disabled={page == 1} onClick={() => setPage(1)}>
            <ArrowLeft />
          </Button>
          <Button disabled={page == 2} onClick={() => setPage(2)}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
