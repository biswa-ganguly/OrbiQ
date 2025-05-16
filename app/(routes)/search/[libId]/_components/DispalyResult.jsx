import {
  LucideImage,
  LucideList,
  LucideSparkles,
  LucideVideo,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import { useParams } from "next/navigation";
import { supabase } from "@/services/Superbase";
import ImagesTab from "./ImagesTab";
import SourcesTab from "./SourcesTab";

const tabs = [
  { label: "Answer", icon: LucideSparkles },
  { label: "Images", icon: LucideImage },
  { label: "Sources", icon: LucideList  },
];

function DispalyResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState("Answer");
  const [searchResult, setSearchResult] = useState(null); // 🔧 initialized properly
  const { libId } = useParams();

  useEffect(() => {
   searchInputRecord?.Chats.length === 0 ? GetSearchApiResult():GetSearchRecords();
  }, [searchInputRecord]);

  const GetSearchApiResult = async () => {
    try {
      const result = await axios.post("/api/brave-search-api", {
        searchInput: searchInputRecord?.searchInput,
        searchType: searchInputRecord?.type,
      });

      const searchResp = result.data;
      setSearchResult(searchResp);

      const formatedSearchResp = searchResp?.web?.results?.map((item) => ({
        title: item?.title,
        description: item?.description,
        long_name: item?.profile?.long_name,
        img: item?.profile?.img,
        url: item?.url,
        thumbnail: item?.thumbnail?.src,
      }));

      console.log("Formatted search result:", formatedSearchResp);

      const { data, error } = await supabase
        .from("Chats")
        .insert([
          {
            libId: libId,
            searchResult: formatedSearchResp,
            userSearchInput: searchInputRecord?.searchInput,
          },
        ])
        .select();
        await GetSearchRecords()
      if (error) {
        console.error("Supabase insert error:", error);
        return;
      }

      if (data?.[0]?.id) {
        await GenerateAiResponse(formatedSearchResp, data[0].id);
      }
    } catch (err) {
      console.error("Error in GetSearchApiResult:", err);
    }
  };

  const GenerateAiResponse = async (formatedSearchResp, recordId) => {
    try {
      const result = await axios.post("/api/llm-model", {
        searchInput: searchInputRecord?.searchInput,
        searchResult: formatedSearchResp,
        recordId: recordId,
      });

      const runId = result.data;

      const interval = setInterval(async () => {
        try {
          const runResp = await axios.post("/api/get-inngest-status", {
            runId: runId,
          });

          if (runResp?.data?.data?.[0]?.status === "Completed") {
            console.log("AI Response completed ✅");
            clearInterval(interval);
            // Optionally refetch updated Chats here
          }
        } catch (err) {
          console.error("Error checking Inngest status:", err);
        }
      }, 1000);
      await GetSearchRecords()
    } catch (err) {
      console.error("Error in GenerateAiResponse:", err);
    }
  };

  const GetSearchRecords =async()=>{
    let { data: library, error } = await supabase
.from('library')
.select('*,Chats(*)')
.eq("libId", libId)

setSearchResult(library[0])
  }

  return (
    <div>
      {searchInputRecord?.Chats?.map((chat, index) => (
        <div className="mt-7" key={index}>
          <h2 className="font-medium text-3xl line-clamp-2">
            {chat?.userSearchInput}
          </h2>

          <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
            {tabs.map(({ label, icon: Icon, badge }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${
                  activeTab === label ? "text-black" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
                {activeTab === label && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                )}
              </button>
            ))}

            <div className="ml-auto text-sm text-gray-500">
              1 task <span className="ml-1">↗</span>
            </div>
          </div>

          <div className="mt-4">
            {activeTab === "Answer" && <AnswerDisplay chat={chat} />}
            {activeTab === "Images" && <ImagesTab chat={chat} />}
            {activeTab === "Sources" && <SourcesTab  chat={chat} />}
            {/* Future: you can conditionally render images/videos/sources here */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DispalyResult;
