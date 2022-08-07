import { useRouter } from "next/router";
import { useState, useEffect, Children } from "react";
import axios from "axios";
import {
  Box,
  ChakraProvider,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

import styles from "../styles/Results.module.css";
import Image from "next/image";
import React, { Component } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { IconContext } from "react-icons";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineLockOpen, HiLockClosed } from "react-icons/hi";
import {
  AiOutlinePlusCircle,
  AiFillPlusCircle,
  AiOutlineMinusCircle,
  AiFillMinusCircle,
} from "react-icons/ai";

// const data = router.query;
// console.log(data);

export default function Results() {
  const [data, setData] = useState([]);
  const [budget, setBudget] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [dog, setDog] = useState(null);
  const [update, setUpdate] = useState(0);
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);    
  const [toggleViewModeFav, setToggleViewModeFav] = useState(true);
  const [toggleViewModeSave, setToggleViewModeSave] = useState(true);
  const router = useRouter();
  
  const { selectedLocation, selectedBudget, selectedEnergy, selectedDog } =
    router.query;
  console.log(`List:`, list);

  //SAVE BUTTON FUNCTIONALITY
  async function patchSaved(input) {
    await fetch(
      `https://saunter-db.herokuapp.com/${router.query.selectedBudget}-budget`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Method": "PATCH",
        },
        body: JSON.stringify(input),
      }
    );
  }

  // UPDATE FORM DATA FUNCTIONALITY

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `https://saunter-db.herokuapp.com/all-budgets`
      );
      let allActivities = response.data.data;
      console.log("allActivities", allActivities);
      let filteredActivities = [];

      if (router.query.selectedDog === "true") {
        router.query.selectedDog = true;
      } else if (router.query.selectedDog === "false") {
        router.query.selectedDog = false;
      }
      console.log(`Router: ${router.query.selectedDog}`);
      console.log(`RouterTO: ${typeof router.query.selectedDog}`);

      for (let i = 0; i < allActivities.length; i++) {
        if (
          allActivities[i].budget == router.query.selectedBudget &&
          allActivities[i].energy_level == router.query.selectedEnergy &&
          allActivities[i].dog_friendly == router.query.selectedDog
        ) {
          console.log(`Activity: ${allActivities[i].dog_friendly}`);
          console.log(`ActivityTO: ${typeof allActivities[i].dog_friendly}`);
          filteredActivities.push(allActivities[i]);
        }
      }
      setData(filteredActivities);
      setCount(filteredActivities.length);
      console.log("filtered", filteredActivities);

      if (update === 0) {
        console.log("Setting list");
        setList([filteredActivities]);
      } else {
        let last = list.length - 1;
        setList([...list.slice(0, last), filteredActivities]);
      }
      //Using slice to immutably copy array and edit last carousel in list to display updated results.
    };

    // query can change, but don't actually trigger
    // request unless submitting is true
    getData();
    console.log(`Update: ${update}`);
    console.log(`List: ${list}`);
  }, [update]);

  function sendingResults() {
    router.query.selectedBudget = budget;
    router.query.selectedEnergy = energy;
    router.query.selectedDog = dog;
    console.log(`Budget: ${budget}`);
    console.log(`Energy: ${energy}`);
    console.log(`Dog: ${dog}`);
    setUpdate(update + 1);
  }

  function addCarousel() {
    setList([...list, data]);
    console.log("setList:", list);
    // setUpdate(update + 1)
  }

  //CAROUSEL START
  const MAX_VISIBILITY = 3;

  const Card = ({ title, content, image }) => (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p>{content}</p>

      <div className = {styles.image_container}>
        <img
          src={image}
          alt="Activity Card Image"
          className={styles.card_image}
        />
      </div>
    </div>
  );

  const Carousel = ({ children }) => {
    const [active, setActive] = useState(0);
    // const count = 10;

    return (
      <div className={styles.carousel}>
        {active > 0 && (
          <button
            className={styles.navleft}
            onClick={function () {
              setActive(active - 1);
            }}
          >
            <FaChevronCircleLeft />
          </button>
        )}
        {Children.map(children, (child, i) => (
          <div
            className={styles.cardcontainer}
            style={{
              "--active": i === active ? 1 : 0,
              "--offset": (active - i) / 3,
              "--direction": Math.sign(active - i),
              "--abs-offset": Math.abs(active - i) / 3,
              "pointer-events": active === i ? "auto" : "none",
              opacity: Math.abs(active - i) >= MAX_VISIBILITY ? "0" : "1",
              display: Math.abs(active - i) > MAX_VISIBILITY ? "none" : "block",
            }}
          >
            {child}
          </div>
        ))}
        {active < count - 1 && (
          <button
            className={styles.navright}
            onClick={function () {
              setActive(active + 1);
            }}
          >
            <FaChevronCircleRight />
          </button>
        )}
      </div>
    );
  };
  //CAROUSEL END

  //div className={styles.results}





  return (
    <div className={styles.main}>
      <h1>Your Recommendations:</h1>
      <div className={styles.app}>
        {list.map((carousel, index) => (
          <Carousel key={index}>
            {carousel.map((activity, index) => (
              <Card key={index} title={activity.name} image={activity.image} />
            ))}
          </Carousel>
        ))}
        <button className={styles.addCarousel} onClick={addCarousel}>
          <IconContext.Provider
            value={{
              color: "black",
              className: "global-class-name",
              size: "3rem",
            }}
          >
            <AiOutlinePlusCircle />
          </IconContext.Provider>
        </button>
      </div>

      {/* chakra ui imported below */}
      <div className="form">
        <ChakraProvider>
          <Box
            width="28.75rem"
            height="100%"
            padding="6"
            borderRadius="none"
            border="2px solid"
            borderColor="black"
            mt="15vh"
            bg="#F9983F"
          >
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Select
                placeholder="Select location"
                border="2px solid"
                borderColor="black"
                bg="white"
              >
                <option>London</option>
              </Select>

              <FormLabel>Budget</FormLabel>
              <Select
                placeholder="Select budget"
                border="2px solid"
                borderColor="black"
                bg="white"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </Select>

              <FormLabel>Energy level</FormLabel>
              <Select
                placeholder="Select energy level"
                border="2px solid"
                borderColor="black"
                bg="white"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </Select>

              <FormLabel>Dog friendly</FormLabel>
              <Select
                placeholder="Select preference"
                border="2px solid"
                borderColor="black"
                bg="white"
                value={dog}
                onChange={(e) => setDog(e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>

              <div className={styles.daybtn}>
                <button className="secondary-btn" onClick={sendingResults}>
                  Update Plan
                </button>
              </div>
            </FormControl>
          </Box>
        </ChakraProvider>
      </div>
    </div>
  );
}



// DESCRIPTION AND SOME FUNCTIONALITY FROM ANOTHER BRANCH. SAVE FOR LATER

  // {data.map((activity) => {
  //   const id = activity.id;
  //   const name = activity.name;
  //   const image = activity.image;
  //   const body = {id: id}
  //   return (

  //     <div className={styles.activity} key={name}>
  //       <h5>{name}</h5>
  //       <div className={styles.imagebtn}>
  //       <img src={image} alt="/" />
  //       <button onClick={function(){return patchSaved(body)}} key={id} className="btn">Save</button>
  //       </div>
  //     </div>
  //   );
  // })}

  //Create a state for the list of carousels
  //Each time 'Add new activity' button is clickes, add new carousel to the list with spread operator
  // State is [list, setList]
  //Map twice:
  //1. Carousels
  //2. Data in the 🎠
  // Save data as state
  // Ensure list is an array of arrays: [[{}]]
  //for description content={activity.description}

//   return (
//     <div className={styles.main}>
//       <h1>Your Recommendations:</h1>
//       <div className={styles.results}></div>
//       <div className={styles.app}>
//         {list.map((carousel, index) => (
//           <Carousel key={index}>
//             {carousel.map((activity, index) => (
//               <Card key={index} title={activity.name} image={activity.image} />
//             ))}
//           </Carousel>
//         ))}
//         <button className={styles.addCarousel} onClick={addCarousel}>
//           <IconContext.Provider
//             value={{
//               color: "black",
//               className: "global-class-name",
//               size: "3rem",
//             }}
//           >
//             <AiOutlinePlusCircle />
//           </IconContext.Provider>
//         </button>
//       </div>
            
//            {/* <button></button> */}
//               {/* onClick={() => setToggleViewModeFav(!toggleViewModeFav)}
//             >
//              {toggleViewModeFav ? ( */}
//                 {/* <AiOutlineHeart */}
//                 {/*   size={35}
//                   onClick={function () { */}
//                    return patchSaved(body);
//                   }}
//                   key={id}
//                   className={styles.favouritesbutton}
//                 />
//               ) : (
//                 <AiFillHeart
//                   className={styles.favouritesbuttonred}
//                   size={35}
//                 />
//               )}
//             </button>
//             <button
//               onClick={() => setToggleViewModeSave(!toggleViewModeSave)}
//             >
//               {toggleViewModeSave ? (
//                 <HiOutlineLockOpen
//                   size={35}
//                   className={styles.savebutton}
//                 />
//               ) : (
//                 <HiLockClosed
//                   className={styles.savebuttonclose}
//                   size={35}
//                 />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   
// <p>
//           Use the Lock icon that is displayed on the activity to save it to your
//           day plan. Once you have saved an activity, click the plus button to
//           look for another activity. Feel free to add as many activities as you
//           like.
//         </p>
       
//         <button>
//           <AiOutlinePlusCircle
//             size={35}
//             className={styles.addbutton}
//             onClick={NewCarousel}
//           />
//         </button> */}
     
    //  chakra ui imported below
    //   <div className="form">
    //     <ChakraProvider>
    //       <Box width="15vw" padding="6" borderRadius="2rem" m="15vh">
    //         <FormControl>
    //           <FormLabel>Location</FormLabel>
    //           <Select placeholder="Select location">
    //             <option>London</option>
    //           </Select>

    //           <FormLabel>Budget</FormLabel>

    //           <Select
    //             placeholder="Select budget"
    //             value={budget}
    //             onChange={(e) => setBudget(e.target.value)}
    //           >
    //             <option value="1">Low</option>
    //             <option value="2">Medium</option>
    //             <option value="3">High</option>
    //           </Select>

    //           <FormLabel>Energy level</FormLabel>
    //           <Select
    //             placeholder="Select energy level"
    //             value={energy}
    //             onChange={(e) => setEnergy(e.target.value)}
    //           >
    //             <option value="1">Low</option>
    //             <option value="2">Medium</option>
    //             <option value="3">High</option>
    //           </Select>

    //           <FormLabel>Dog friendly</FormLabel>
    //           <Select
    //             placeholder="Select preference"
    //             value={dog}
    //             onChange={(e) => setDog(e.target.value)}
    //           >
    //             <option value="true">Yes</option>
    //             <option value="false">No</option>
    //           </Select>
    //           <div className={styles.daybtn}>
    //             <button className="btn" onClick={sendingResults}>
    //               Create Day Plan
    //             </button>
    //           </div>
    //         </FormControl>
    //       </Box>
    //     </ChakraProvider>
    //   </div>
    // </div>
