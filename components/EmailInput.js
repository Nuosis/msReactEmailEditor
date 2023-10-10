import React,{useState} from "react"


export default function EmailInput({id,title,unchosenEmails,setUnchosenEmails,chosenEmails,setChosenEmails}) {
  const [value, setValue]=useState('');
  //const [chosenEmails, setChosenEmails]=useState([]);
  const [suggestions, setSuggestions]=useState([]);
  const [error, setError]=useState(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    setError(null);
  };
  
  const handleDelete = (index) => {
    const thisEmail = chosenEmails.filter((email) => chosenEmails.indexOf(email) === index)
    console.log(thisEmail);
    setUnchosenEmails([...unchosenEmails,...thisEmail]);
    setChosenEmails(chosenEmails.filter((email) => chosenEmails.indexOf(email) !== index));
  };

  const isInList = (email) => {
    return chosenEmails.includes(email);
  };

  const isEmail = (email) => {
    // eslint-disable-next-line
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  const isValid = (email) => {
    let err = null;
    if (!isEmail(email)) {
      err = `${email} is not a valid email address.`;
    }
    if (isInList(email)) {
      err = `${email} has already been added.`;
    }
    if (isEmail(email)) {
      // eslint-disable-next-line
      //return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
      return email
    }
    if (err) {
      setError(err);
      return false;
    }
    return true;
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, `i`);
      //console.log(unchosenEmails);
      const foundEmails = unchosenEmails.sort().filter(v => regex.test(v));
      setSuggestions(foundEmails);
      setValue(value);
    } else {
      console.log(value)
      setSuggestions([]);
    };
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      if (value && isValid(value)) {
        setChosenEmails([...chosenEmails, value]);
        setValue("");
        setSuggestions([]);
        e.preventDefault();
      } else if (value && !isValid(value)) {
        e.preventDefault();
      }
    }
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      console.log("length=0")
      return;
    }
    return (
      <ul>
        {suggestions.map(email => <li key={email} 
        onClick = {() => {
          setChosenEmails([...chosenEmails, email]);
          setUnchosenEmails(unchosenEmails.filter((item)=>{return item !== email}))
          setSuggestions([])
          setValue("");
        }
        }
        >{email}</li>)}
      </ul>
    )
  };
  return (
      <div className="flex flex-row items-center gap-2">
        {/* <label
          htmlFor="email"
          className=" mt-1
                      mb-1
                      w-9
                      text-right 
                      block text-sm 
                      font-medium 
                      leading-6 
                      text-gray-900 "
        >
          {`${title}: `}
        </label> */}
        <div id={`${id}Chips`} className="flex-row w-full mt-1 mb-1">
          <div className="flex flex-wrap">
            {chosenEmails.map((email,i) => (
            <div className="mb-1 bg-white text-sm w-auto pl-2 pr-2 rounded-xl border-sky-900 border drop-shadow-md" key={email}>
              {email}
              <button
                type="button"
                className="ml-1 mr-1 p-0.5 flex-None w-15"
                onClick={() => handleDelete(i)}
              >
                &times;
              </button>
            </div>
          ))}
          </div>
        <div>
          <input
            type="email"
            name="email"
            id={`${id}Input`}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className=" block 
                        w-full 
                        rounded-md 
                        border-0 
                        px-1.5
                        py-1.5 
                        text-zinc-900 
                        shadow-sm 
                        ring-1 
                        ring-inset 
                        ring-gray-300 
                        placeholder:text-zinc-500 
                        focus:ring-0 
                        focus:ring-inset 
                        focus:ring-gray-400 
                        sm:text-sm 
                        sm:leading-6
                        bg-inherit 
                        "
            placeholder={`+ ${title} email`}
          />
        </div>
          {error && <p className="error">{error}</p>}
          {suggestions.length>0 && renderSuggestions()}
        </div>
      </div>
    );
  }