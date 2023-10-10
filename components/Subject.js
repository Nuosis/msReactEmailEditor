//create a subject input function component. Export it so it can be used in other files
import React,{useState} from "react"
export default function Subject({ title, setSubjectBody, subjectBody }) {
  const handleChange = (e) => {
    setSubjectBody(e.target.value);
    //console.log("subjectBody:",e.target.value);
  };
  return (
    <div className="flex flex-row items-center gap-2">
      <input
            type="text"
            name="subject"
            id="subjectText"
            className=" mt-1 mb-1 block w-full rounded-md border-0 px-1.5 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 
                        placeholder:text-zinc-500 
                        focus:ring-0 
                        focus:ring-inset 
                        focus:ring-gray-400 
                        sm:text-sm 
                        sm:leading-6
                        bg-inherit 
                        "
            placeholder="+ subject"
            value={subjectBody}
            onChange={handleChange}
      />
    </div>
  );
}
