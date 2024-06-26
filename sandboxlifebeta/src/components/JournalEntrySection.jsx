import { ArrowPathIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

export const JournalEntrySection = ({
  triggerQuestion,
  triggerIcon,
  chapterEntry,
  onCancel,
  onSave,
  journalEntry,
  setJournalEntry,
  changeQuestion
}) => {
  const [input, setInput] = useState('');
  const handleTextChange = (e) => {
    // setInput(e.target.value);
    setJournalEntry(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 mt-56 md:mt-40 ">
      <div className="bg-bgpapyrus rounded-md shadow-md p-4 max-w-2xl sm:w-auto md:w-[40rem]">
        <h2 className="text-lg font-semibold mb-2">The Story...</h2>
        <p className="text-gray-600 mb-4">2. Answer the trigger question.</p>
        <div className="flex items-center justify-center mb-4">
          <img className="w-16 h-16" src={triggerIcon} alt="Trigger Icon" />
        </div>
        <p className="text-gray-800 mb-4">{typeof triggerQuestion === "string" ? triggerQuestion:triggerQuestion[0]}</p>
        {/* <ArrowPathIcon className='w-5 ml-auto m-2 cursor-pointer ' onClick={()=>changeQuestion()} /> */}
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md resize-none"
          rows={4}
          value={journalEntry}
          onChange={handleTextChange}
          placeholder="Chapter Entry 'The Story'"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none mr-2"
          >
            Back
          </button>
          <button
            onClick={onSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Save &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// export default JournalEntrySection;
