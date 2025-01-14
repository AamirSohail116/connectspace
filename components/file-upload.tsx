"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "serverImage" | "messageFile";
  value: string;
}

export const FileUpload = ({ onChange, endpoint, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  console.log(fileType);

  if (value && fileType !== "pdf") {
    return (
      <div className=" relative h-20 w-20">
        <Image fill alt="Upload" src={value} className=" rounded-full" />
        <button
          onClick={() => onChange("")}
          className=" bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className=" h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className=" relative flex items-center p-2 mt-2  rounded-md bg-background/10">
        <FileIcon className=" h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className=" ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className=" bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className=" h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log("error", error);

        toast.error(`${error?.message}`);
      }}
    ></UploadDropzone>
  );
};
