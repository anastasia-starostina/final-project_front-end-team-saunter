import { useRouter } from 'next/router'
import { useState, useEffect, Children } from 'react'
import axios from 'axios'
import {
	Box,
	ChakraProvider,
	FormControl,
	FormLabel,
	Select,
} from '@chakra-ui/react'


import styles from '../styles/Results.module.css'
import Image from 'next/image'
import React, { Component } from 'react'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { HiOutlineLockOpen, HiLockClosed } from 'react-icons/hi'

import {
	AiOutlinePlusCircle,
	AiFillPlusCircle,
	AiOutlineMinusCircle,
	AiOutlineHeart,
	AiFillHeart,
	AiFillMinusCircle,
} from 'react-icons/ai'

// const data = router.query;
// console.log(data);

export default function Results() {
	const router = useRouter()
	const { selectedLocation, selectedBudget, selectedEnergy, selectedDog } = router.query;
	const [data, setData] = useState([])
	const [budget, setBudget] = useState(router.query.selectedBudget)
	const [energy, setEnergy] = useState(router.query.selectedEnergy)
	const [dog, setDog] = useState(router.query.selectedDog)
	const [update, setUpdate] = useState(0)
	const [count, setCount] = useState(0)
	const [toggleViewModeFav, setToggleViewModeFav] = useState(true)
	const [toggleViewModeSave, setToggleViewModeSave] = useState(true)
  const [active, setActive] = useState(0)
  const [cart, setCart] = useState([])

	//SAVE BUTTON FUNCTIONALITY
	async function patchSaved(input) {
		await fetch(
			`https://saunter-db.herokuapp.com/all-budgets`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Request-Method': 'PATCH',
				},
				body: JSON.stringify(input),
			}
		)
	}

	// UPDATE FORM DATA FUNCTIONALITY

	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				`https://saunter-db.herokuapp.com/all-budgets`
			)
			let allActivities = response.data.data
			console.log('allActivities', allActivities)
			let filteredActivities = []

			if (router.query.selectedDog === 'true') {
				router.query.selectedDog = true
			} else if (router.query.selectedDog === 'false') {
				router.query.selectedDog = false
			}
			console.log(`Router: ${router.query.selectedDog}`)
			console.log(`RouterTO: ${typeof router.query.selectedDog}`)

			for (let i = 0; i < allActivities.length; i++) {
				if (
					(allActivities[i].budget == router.query.selectedBudget || router.query.selectedBudget == "Any") &&
					(allActivities[i].energy_level == router.query.selectedEnergy || router.query.selectedEnergy == "Any") &&
					(allActivities[i].dog_friendly == router.query.selectedDog || router.query.selectedDog == "Any")
				) {
					filteredActivities.push(allActivities[i])
				}
			}
			setData(filteredActivities)
			setCount(filteredActivities.length)
			console.log('filtered', filteredActivities)
		}

		// query can change, but don't actually trigger
		// request unless submitting is true
		getData()
		console.log(`Update: ${update}`)
	}, [update])

	function sendingResults() {
		router.query.selectedBudget = budget
		router.query.selectedEnergy = energy
		router.query.selectedDog = dog
		console.log(`Updated budget: ${budget}`)
		console.log(`Updated energy: ${energy}`)
		console.log(`Updated dog: ${dog}`)
		setUpdate(update + 1)
	}

	//CAROUSEL START
	const MAX_VISIBILITY = 3

	const Card = ({ title, content, image, patch, add }) => (
		<div className={styles.card}>
			<h2>{title}</h2>
			<p>{content}</p>

			<div className={styles.image_container}>
				<img
					src={image}
					alt='Activity Card Image'
					className={styles.card_image}
				/>
			</div>
      <button onClick={patch} className={styles.heart}>Heart</button>
      <button onClick={add} className={styles.lock}>Add</button>
		</div>
	)

	const Carousel = ({ children }) => {

		return (
			<div className={styles.carousel}>
				{active > 0 && (
					<button
						className={styles.navleft}
						onClick={function () {
							setActive(active - 1)
              console.log(active)
						}}
					>
						<FaChevronCircleLeft />
					</button>
				)}
				{Children.map(children, (child, i) => (
					<div
						className={styles.cardcontainer}
						style={{
							'--active': i === active ? 1 : 0,
							'--offset': (active - i) / 3,
							'--direction': Math.sign(active - i),
							'--abs-offset': Math.abs(active - i) / 3,
							'pointer-events': active === i ? 'auto' : 'none',
							opacity: Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
							display: Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
						}}
					>
						{child}
					</div>
				))}
				{active < count - 1 && (
					<button
						className={styles.navright}
						onClick={function () {
							setActive(active + 1)
              console.log(active)
						}}
					>
						<FaChevronCircleRight />
					</button>
				)}
			</div>
		)
	}
	//CAROUSEL END


	// Heart button functionality
	const HeartButton = () => (
		<div className={styles.heart_button}>
			<button onClick={() => setToggleViewModeFav(!toggleViewModeFav)}>
				{toggleViewModeFav ? (
					<AiOutlineHeart
						size={35}
						onClick={function () {
							return patchSaved(body)
						}}
						key={id}
						className={styles.favouritesbutton}
					/>
				) : (
					<AiFillHeart className={styles.favouritesbuttonred} size={35} />
				)}
			</button>
		</div>
	)

// Lock Button functionality
const LockButton = () => (
  <div className={styles.lock_button}>
  		<button onClick={() => setToggleViewModeSave(!toggleViewModeSave)}>
				{toggleViewModeSave ? (
					<HiOutlineLockOpen size={35} className={styles.savebutton} />
				) : (
					<HiLockClosed className={styles.savebuttonclose} size={35} />
				)}
			</button>
  </div>
);

function addToCart(activity) {
  setCart([...cart, activity])
  console.log(`Activity:`, activity)
  console.log(`Cart:`, cart)
}

	return (
		<div className={styles.main}>
			<h1>Your Recommendations:</h1>
			<div className={styles.results}></div>
			<div className={styles.app}>
					<Carousel>
						{data.map((activity, index) => (
							<Card key={index} title={activity.name} image={activity.image} patch={function () {return patchSaved(activity.id)}} add={function() {return addToCart(activity)}}/>
						))}
					</Carousel>
      <div className={styles.cart}>
      <p>{cart.length}</p>
      <button className={styles.dayplanbtn}>View Day Plan</button>
      </div>
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
                <option value="Any">Any</option>
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
                <option value="Any">Any</option>
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
                <option value="Any">Any</option>
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
	
