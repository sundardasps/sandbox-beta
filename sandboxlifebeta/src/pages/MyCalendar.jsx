import { useState, useEffect, useRef } from "react";
import CalendarDateHeader from "../components/CalendarDateHeader";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import { fetchAllEntries, fetchEntries } from "../utils/supabase";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link, animateScroll as scroll } from 'react-scroll';
import JournalEntry from "../components/JournalEntry";
import { formatJournalType } from "../utils/helpers";
import EntryDetails from "../components/EntryDetails";

export default function MyCalendar() {
  const { userId } = useParams();
  // const date = parseISO(datetimeStr);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [entries, setEntries] = useState([]);

  

  //Check activity//
  const monthAndRef = useRef();
  const [value, setValue] = useState("");
  const [selectedDay, setSelectedDay] = useState();
  const [totalDays, setTotalDays] = useState();
  const [total, setTotal] = useState(new Array(31).fill(null).map(() => []));
  const [monthAndYear, setMonthAndYear] = useState("");
  const [selected, setSelected] = useState(null)

  // const [userId, setUserId] = useState(null);
  useEffect(() => {
    fetchEntries(userId, "daily_journal", 50)
      .then((data) => {
        console.log("My Calendar", data);
        let tempData = data.map((entry) => {
          // Format the created_at field
          const formattedDatetime = formatDatetime(entry.created_at);
          // Add the formatted date and time to the entry
          return {
            ...entry,
            date: formattedDatetime.date,
            time: formattedDatetime.time,
          };
        });
        setEntries(tempData);
      })
      .catch((error) => {
        console.log("ERROR", error), toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    const handleAllData = async (selectedMonth) => {
      try {
        const storedUserId = localStorage.getItem("user_id");
        const date = new Date(selectedMonth);
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const startDay = date.toISOString();
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        const lastDay = date.toISOString();
        const result = await fetchAllEntries(storedUserId, startDay, lastDay);

        if (result.length >= 0) {
          const newDataArray = new Array(31).fill(null).map(() => []);
          result.forEach((entry) => {
            const dayOfMonth = new Date(entry.created_at).getDate();
            newDataArray[dayOfMonth - 1].push(entry);
          });
          setTotal(newDataArray);
          setTotalDays(date.getDate());
          setMonthAndYear(`${month}-${year}`);
        } else {
          toast.error("Somthing wrong❗");
        }
      } catch (error) {
        console.log(error);
      }
    };
    value.length > 0 && handleAllData(value);
  }, [value]);

  const handlePrevClick = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1))
    );
  };

  const handleNextClick = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1))
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  function formatDatetime(datetimeStr) {
    // Create a Date object from the datetime string
    const date = new Date(datetimeStr);

    // Function to extract date part (YYYY-MM-DD)
    function formatDate() {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    // Function to extract time part (hh:mm)
    function formatTime() {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    }

    // Return the desired formats
    return {
      date: formatDate(),
      time: formatTime(),
    };
  }

  const formatTime = (dateObj) => {
    const hrs = dateObj.getHours();
    const mns = dateObj.getMinutes();
    const formattedHours = hrs < 10 ? `0${hrs}` : hrs;
    const formattedMinutes = mns < 10 ? `0${mns}` : mns;
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleOnClick = (data) => {
    setSelected(data);
};

  return (
    <div className="">
      <TopBar toggleMenu={toggleMenu} />

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <CalendarDateHeader
        currentDate={currentDate}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
      <ToastContainer />

      <div className=" w-full   mt-40">
        <div className="mx-auto  w-min border-2  rounded-md flex flex-col p-1 my-5  text-start text-sm ">
          <p className="right-5 text-center font-semibold ">Check activity</p>
          <input
            ref={monthAndRef}
            type="month"
            className=" rounded-md px-1 cursor-pointer hover:bg-darkpapyrus"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      {value&&<div className="grid md:flex  ">
      <div className=" w-auto md:w-1/2  px-2 mb-10">
      <h2 className="text-lg font-bold">Calendar</h2>
          <div className="w-auto sm:w-[23rem] lg:w-[24rem]  m-auto bg-darkpapyrus shadow-2xl shadow-[#000000] border rounded-md  p-1   ">
            <XMarkIcon
              onClick={() => {
                (monthAndRef.current.value = ""),
                  setTotalDays();
                setMonthAndYear();
                setTotal(new Array(31).fill(null).map(() => []));
                setSelectedDay();
                setValue("")
              }}
              className="ml-auto my-1 w-6  bg-bgpapyrus shadow-md border cursor-pointer rounded-md"
            />

            <span>{monthAndYear && monthAndYear}</span>
            <div className=" grid  grid-cols-6 gap-1 p-1 w-full h-full border rounded-md ">
              {total?.map((value, index) => (
                <Link  key={index} activeClass="active" to="section1" spy={true} smooth={true} duration={500}>
                <div
                 
                  onClick={() => setSelectedDay(value)}
                  className={` bg-opacity-35 h-11 w-11  md:h-14 md:w-14 cursor-pointer  ${
                    index + 1 <= totalDays ? "bg-red" : "bg-[#000000] "
                  } `}
                >
                  {" "}
                  <p className="absolute  text-xs">{index + 1}</p>
                  
                  {value.length ? (
                    <img
                      src={value[0].journal_icon}
                      alt=""
                      className=" object-cover h-auto md:h-14 w-full"
                    />
                  ) : (
                    ""
                  )}
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className=" h-[25vh] md:hidden" id="section1"></div>
        <div className="w-auto  md:w-1/2   " >
        <h2 className="text-lg font-bold ">Activity</h2>
          {selectedDay &&
            selectedDay.map((value, index) => (
              // <div
              //   key={index}
              //   className="bg-white border shadow-md rounded-lg p-4 w-auto mx-2 mb-2 h-min"
              // >
              //   <h2 className="text-lg font-bold">{value.journal_type}</h2>
              //   <div className="flex justify-between items-center mb-2">
              //     <h3 className="text-sm font-bold">
              //       {value.journal_meaning}
              //     </h3>
              //     {value.journal_icon && (
              //       <img
              //         src={value.journal_icon}
              //         alt="Image"
              //         className="h-6 w-6"
              //       />
              //     )}
              //   </div>
              //   <p className="flex items-left text-gray-700 mb-2">
              //     {formatDatetime(value.created_at).date} at{" "}
              //     {value.created_at && formatTime(new Date(value.created_at))}
              //   </p>
              //   <p className="text-gray-600">{value.journal_entry}</p>
              // </div>
              <div key={index} className='my-2 cursor-pointer' 
               onClick={()=>handleOnClick(value)} 
               >
              <JournalEntry
                id={value.id}
                title={formatJournalType(value.journal_type)}
                iconTitle={value.journal_meaning}
                // date="10th March 2023"
                date={formatDatetime(value.created_at).date}
                image={value.journal_icon}
                message={value.journal_entry}
                time={formatDatetime(value.created_at).time} 
                // selected={selected}
              />
              </div>
                
            ))}

                {selected && <EntryDetails  id={selected.id}
                title={formatJournalType(selected.journal_type)}
                iconTitle={selected.journal_meaning}
                // date="10th March 2023"
                date={formatDatetime(selected.created_at).date}
                image={selected.journal_icon}
                message={selected.journal_entry}
                time={formatDatetime(selected.created_at).time} 
                selected={selected} 
                setSelected={setSelected}
                />}
        </div>
      </div>}
      </div>
      <ToastContainer />
    </div>
  );
}
