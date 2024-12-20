import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [userInitialPrompt, setUserInitialPrompt] = useState("");
  return (
    <div className="h-screen w-screen flex flex-col flex-wrap space-y-4 content-center justify-center bg-gray-800">
      <h1 className="text-6xl text-center font-bold text-white italic">
        AIWebsiteBuilder
      </h1>
      <p className="text-gray-300 text-center">
        {" "}
        Describe your React or NodeJS application, and we'll help you build it
        step by step
      </p>
      <Textarea
        placeholder="Type how you want your website should look like..."
        className="w-[50%] bg-gray-800 shadow-xl h-32 rounded-md p-4"
        onChange={(e) => {
          setUserInitialPrompt(e.target.value);
        }}
      />

      <button
        className=" bg-blue-900 p-3 rounded text-white"
        onClick={() => {
          if (userInitialPrompt.trim())
            navigate("/builder", { state: { userInitialPrompt } });
        }}
      >
        CREATE WEBSITE
      </button>
    </div>
  );
};

export default LandingPage;
