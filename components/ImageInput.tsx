import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useUploadOrEditImageMutation } from "@/store/features/authApi";

const ImageInput = ({
  setShowModal,
}: {
  setShowModal: (state: boolean) => void;
}) => {
  const [uploadHandler, { isLoading, error }] = useUploadOrEditImageMutation();

  const [isCamera, setIsCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImage(dataUrl);
      };
      reader.readAsDataURL(file);

      console.log("Selected file:", file);
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    // Access webcam
    if (isCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
        });
    }

    // Cleanup function to stop the stream when component unmounts or isCamera changes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCamera]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setImage(dataUrl); // Store image as base64 URL
      }
    }
  };

  const retakePhoto = () => {
    setImage(null);

    // Stop current stream
    if (videoRef.current && videoRef.current.srcObject) {
      const currentStream = videoRef.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
    }

    setTimeout(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((newStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        })
        .catch((err) => {
          console.error("Error restarting webcam:", err);
        });
    }, 100);
  };

  const closeCamera = () => {
    // Stop current stream
    if (videoRef.current && videoRef.current.srcObject) {
      const currentStream = videoRef.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
    }
    setIsCamera(false);
  };

  const handleFileUpload = async () => {
    if (!image) return;

    try {
      // Convert data URL to File object
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "profile-image.png", { type: "image/png" });

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file
      const { data } = await uploadHandler({ formData });

      if (data.success) {
        console.log("Image uploaded successfully:", data);
        setShowModal(false);
        // You can add a success notification here
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // You can add an error notification here
    }
  };

  return (
    <div className="absolute right-1/3 top-1/5 bg-white shadow-md w-1/3 rounded-md p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-4 text-center">Choose Image</h2>
        <Button onClick={() => setShowModal(false)} className="cursor-pointer">
          <X />
        </Button>
      </div>
      <div className="flex items-center justify-between mt-6">
        {/* Choose from Drive */}
        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
          Upload from Device
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>

        {/* Capture from Camera */}
        <button
          onClick={() => setIsCamera(true)}
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600"
        >
          Take Photo with Camera
        </button>
      </div>

      {image && (
        <img
          src={image}
          alt="Selected image"
          width={150}
          height={150}
          className="mx-auto mt-4 rounded"
        />
      )}

      <div className="mt-12 flex items-center justify-between">
        <Button
          variant={"destructive"}
          onClick={() => setShowModal(false)}
          className=""
        >
          Cancel
        </Button>
        <Button
          onClick={handleFileUpload}
          disabled={isLoading || !image}
          className=""
        >
          {isLoading ? "Uploading..." : "Save"}
        </Button>
      </div>

      {isCamera && (
        <div className="p-4 absolute top-0">
          {!image ? (
            <div>
              <video
                ref={videoRef}
                autoPlay
                width="640"
                height="480"
                className="mb-4 border rounded shadow"
              />
              <button
                onClick={captureImage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Capture
              </button>
            </div>
          ) : (
            <div>
              <img
                src={image}
                alt="Captured"
                className="mb-4 border rounded shadow"
              />
              <div className="">
                <Button
                  onClick={retakePhoto}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Retake
                </Button>
                <Button
                  onClick={() => {
                    closeCamera();
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageInput;
