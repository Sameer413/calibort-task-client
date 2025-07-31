"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetThirdPartyUserQuery } from "@/store/features/authApi";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams();

  const id = params.id as string;

  const { isLoading, data } = useGetThirdPartyUserQuery({ id: id });
  return (
    <div className="h-full relative">
      {isLoading ? (
        <div className="h-full items-center flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="w-1/3 mx-auto mt-12 flex flex-col items-center">
          <div className="text-center font-semibold text-2xl">
            Third Party User Profile
          </div>

          <div className="h-36 my-6">
            {data?.user.avatar && (
              <Image
                src={data?.user.avatar}
                alt="user image"
                className="my-4"
                width={150}
                height={150}
              />
            )}
          </div>

          <form className="flex flex-col gap-3 w-full">
            <Input
              placeholder="Full Name"
              value={data?.user.first_name + " " + data?.user.last_name}
              type="text"
              disabled
              aria-label="Full Name"
            />
            <Input
              placeholder="Email address"
              value={data?.user.email}
              type="text"
              disabled
              aria-label="Email address"
            />

            <Button variant={"link"}>
              <Link href={"/"}>Go to home</Link>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
