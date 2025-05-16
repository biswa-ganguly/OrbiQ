"use client"
import { supabase } from '@/services/Superbase'
import { useUser } from '@clerk/nextjs'
import { Clock, ArrowUpRightFromSquare } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [libraryHistory, setLibraryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetLibraryHistory = async () => {
    if (!user) return;

    setLoading(true);
    const { data: library, error } = await supabase
      .from('library')
      .select('*')
      .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
    } else {
      setLibraryHistory(library || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      GetLibraryHistory();
    }
  }, [user]);

  const SkeletonCard = () => (
    <div className="p-4 bg-gray-200 rounded shadow animate-pulse">
      <div className="h-4 w-3/4 bg-gray-300 mb-2 rounded"></div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const handleOpen = (id) => {
    router.push(`/search/${id}`);
  };

  return (
    <div className="lg:px-32 lg:mt-20 px-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Library History</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {libraryHistory.length > 0 ? (
            libraryHistory.map((item, index) => (
              <div key={index} className="p-5 bg-white text-black rounded-xl shadow-md border border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800">{item.searchInput}</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{moment(item?.created_at).fromNow()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpen(item.libId)}
                  className="text-gray-500 hover:text-blue-600 transition"
                  title="Open search result"
                >
                  <ArrowUpRightFromSquare className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No history found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
