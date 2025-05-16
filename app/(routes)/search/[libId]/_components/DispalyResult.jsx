import {
  LucideImage,
  LucideList,
  LucideSparkles,
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
  { label: "Sources", icon: LucideList },
];

function DispalyResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState("Answer");
  const [searchResult, setSearchResult] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [newSearchInput, setNewSearchInput] = useState(""); // new
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const latestChatRef = React.useRef(null);
  const { libId } = useParams();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll < scrollPosition) {
        setShowSearchBar(true); // scrolling up
      } else {
        setShowSearchBar(false); // scrolling down
      }
      setScrollPosition(currentScroll);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  useEffect(() => {
    searchInputRecord?.Chats.length === 0 ? GetSearchApiResult() : GetSearchRecords();
  }, [searchInputRecord]);

  const handleNewSearch = () => {
    if (!newSearchInput.trim()) return;
    const newRecord = {
      searchInput: newSearchInput,
      type: "web",
      Chats: [],
    };
    GetSearchApiResult(newRecord);
  };

  const GetSearchApiResult = async (customInputRecord = searchInputRecord) => {
    setLoadingSearch(true);
    try {
      const result = await axios.post("/api/brave-search-api", {
        searchInput: customInputRecord?.searchInput,
        searchType: customInputRecord?.type,
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

      const { data, error } = await supabase
        .from("Chats")
        .insert([
          {
            libId: libId,
            searchResult: formatedSearchResp,
            userSearchInput: customInputRecord?.searchInput,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        setLoadingSearch(false);
        return;
      }

      if (data?.[0]?.id) {
        await GenerateAiResponse(formatedSearchResp, data[0].id);
      } else {
        setLoadingSearch(false);
      }
    } catch (err) {
      console.error("Error in GetSearchApiResult:", err);
      setLoadingSearch(false);
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
          const runResp = await axios.post("/api/get-inngest-status", { runId });

          if (runResp?.data?.data?.[0]?.status === "Completed") {
            clearInterval(interval);
            setLoadingSearch(false);
            await GetSearchRecords();
          }
        } catch (err) {
          console.error("Error checking Inngest status:", err);
        }
      }, 1000);
    } catch (err) {
      console.error("Error in GenerateAiResponse:", err);
      setLoadingSearch(false);
    }
  };

  const GetSearchRecords = async () => {
    const { data: library, error } = await supabase
      .from("library")
      .select("*,Chats(*)")
      .eq("libId", libId)
      .order("id", { foreignTable: "Chats", ascending: true });
  
    if (!error && library?.length) {
      setSearchResult(library[0]);
  
      // Delay scrolling to ensure DOM is updated
      setTimeout(() => {
        latestChatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };
  

  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse mt-7">
      <div className="h-10 w-3/4 bg-gray-300 rounded" />
      <div className="flex items-center space-x-6 border-b border-gray-200 pb-2">
        {tabs.map(({ label }, i) => (
          <div
            key={label}
            className={`h-8 w-24 bg-gray-300 rounded ${i === 0 ? "w-32" : ""}`}
          />
        ))}
      </div>
      <div className="mt-4 space-y-4">
        <div className="h-6 w-full bg-gray-300 rounded" />
        <div className="h-6 w-5/6 bg-gray-300 rounded" />
        <div className="h-6 w-4/6 bg-gray-300 rounded" />
      </div>
    </div>
  );

  if (loadingSearch || !searchInputRecord?.Chats?.length) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg border border-gray-300 rounded-full flex items-center px-4 py-2 space-x-2">
          <input
            type="text"
            placeholder="Search new topic..."
            className="outline-none text-sm bg-transparent"
            value={newSearchInput}
            onChange={(e) => setNewSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNewSearch()}
          />
          <button
            onClick={handleNewSearch}
            className="text-sm text-white bg-black rounded-full px-3 py-1 hover:bg-gray-800"
          >
            Search
          </button>
        </div>
        {SkeletonLoader()}
      </>
    );
  }






  return (
    <div>
      {showSearchBar && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg border border-gray-300 rounded-full flex items-center px-4 py-2 space-x-20 transition-opacity duration-300 ease-in-out">
    <input
      type="text"
      placeholder="Search new topic..."
      className="outline-none text-sm bg-transparent"
      value={newSearchInput}
      onChange={(e) => setNewSearchInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleNewSearch()}
    />
    <button
      onClick={handleNewSearch}
      className="text-sm text-white bg-black rounded-full px-3 py-1 hover:bg-gray-800"
    >
      Search
    </button>
  </div>
)}

      {searchInputRecord?.Chats?.map((chat, index) => (
        <div className="mt-7" key={index} ref={index === searchInputRecord.Chats.length - 1 ? latestChatRef : null}>
          <h2 className="font-medium text-3xl line-clamp-2">{chat?.userSearchInput}</h2>

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
            {activeTab === "Answer" && (
              <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />
            )}
            {activeTab === "Images" && <ImagesTab chat={chat} />}
            {activeTab === "Sources" && <SourcesTab chat={chat} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DispalyResult;
