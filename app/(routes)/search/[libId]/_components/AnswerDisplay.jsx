import Image from 'next/image';
import React from 'react';
import SourceList from './SourceList';
import DisplaySummery from './DisplaySummery';

function AnswerDisplay({ chat,loadingSearch }) {
  
  return (
    <div className="space-y-4 mt-4">
      <SourceList webResult={chat?.searchResult} loadingSearch={loadingSearch}/>
      <hr className='border-r-yellow-600  h-1'/>
      <DisplaySummery aiResp={chat?.aiResp} />
    </div>
  );
}

export default AnswerDisplay;
