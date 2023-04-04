import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, Children } from 'react';
import axios from 'axios';
import {
	Box,
	ChakraProvider,
	FormControl,
	FormLabel,
	Select,
} from '@chakra-ui/react';

import styles from '../styles/Results.module.css';
import Image from 'next/image';
import React, { Component } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { HiOutlineLockOpen, HiLockClosed } from 'react-icons/hi';

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
	const {
		selectedLocation,
		selectedBudget,
		selectedEnergy,
		selectedDog,
		selectedType,
	} = router.query
	const [data, setData] = useState([])
	const [budget, setBudget] = useState(router.query.selectedBudget)
	const [energy, setEnergy] = useState(router.query.selectedEnergy)
	const [dog, setDog] = useState(router.query.selectedDog)
	const [type, setType] = useState(router.query.selectedType)
	const [update, setUpdate] = useState(0)
	const [count, setCount] = useState(0)
	const [toggleViewModeFav, setToggleViewModeFav] = useState(true)
	const [toggleViewModeSave, setToggleViewModeSave] = useState(true)
	const [active, setActive] = useState(0)
	const [cart, setCart] = useState([0])

	//SAVE BUTTON FUNCTIONALITY
	async function patchSaved(input) {
		await fetch(`https://saunter-server.onrender.com/all-budgets`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Method": "PATCH",
      },
      body: JSON.stringify(input),
    });
	}

	// UPDATE FORM DATA FUNCTIONALITY

	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
        `https://saunter-server.onrender.com/all-budgets`
      );
			let allActivities = response.data.data
			console.log('allActivities', allActivities)
			console.log('query', router.query)
			let filteredActivities = []

			if (router.query.selectedDog === 'true') {
				router.query.selectedDog = true
			} else if (router.query.selectedDog === 'false') {
				router.query.selectedDog = false
			}

			for (let i = 0; i < allActivities.length; i++) {
				if (
					(allActivities[i].budget == router.query.selectedBudget ||
						router.query.selectedBudget == 'Any') &&
					(allActivities[i].energy_level == router.query.selectedEnergy ||
						router.query.selectedEnergy == 'Any') &&
					(allActivities[i].dog_friendly == router.query.selectedDog ||
						router.query.selectedDog == 'Any') &&
					(allActivities[i].type == router.query.selectedType ||
						router.query.selectedType == 'Any')
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
		router.query.selectedType = type
		console.log(`Updated budget: ${budget}`)
		console.log(`Updated energy: ${energy}`)
		console.log(`Updated dog: ${dog}`)
		setUpdate(update + 1)
	}

	//CAROUSEL START
	const MAX_VISIBILITY = 3

	const Card = ({ activity, title, image, add, patch, key, liked, index }) => (
		<div className={styles.card}>
			<div className={styles.title}>
				<h2>{title}</h2>
			</div>

			<div className={styles.image_container}>
				<img
					src={image}
					alt='Activity Card Image'
					className={styles.card_image}
				/>
			</div>
			{/* PATCH REQUEST */}
			<div className={styles.buttonbar}>
				<button
					key={key}
					onClick={function () {
						console.log('Patched:', { patch })
						let updatedSaved = { saved: !liked }
						const updatedActivity = { ...activity, ...updatedSaved }
						console.log('Updated activity:', updatedActivity)
						setData([
							...data.slice(0, index),
							updatedActivity,
							...data.slice(index + 1, data.length),
						])
						return patchSaved(patch)
					}}
				>
					{liked ? (
						<AiFillHeart size={35} className={styles.heartred} />
					) : (
						<AiOutlineHeart size={35} className={styles.heart} />
					)}
				</button>
				<button onClick={add} className={styles.lock}>
					{cart.includes(activity.id) ? (
						<div className={styles.minus}>
							<AiOutlineMinusCircle size={35} />
						</div>
					) : (
						<div className={styles.plus}>
							<AiOutlinePlusCircle size={35} />
						</div>
					)}
				</button>
			</div>
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
						<FaChevronCircleLeft
							style={{ stroke: 'black', strokeWidth: '30' }}
							className={styles.icon}
						/>
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
						<FaChevronCircleRight
							style={{ stroke: 'black', strokeWidth: '30' }}
							className={styles.icon}
						/>
					</button>
				)}
			</div>
		)
	}
	//CAROUSEL END

	// Heart button functionality
	const HeartButton = ({ patch }) => (
		<div>
			<button onClick={() => setToggleViewModeFav(!toggleViewModeFav)}>
				{toggleViewModeFav ? (
					<AiOutlineHeart
						size={35}
						onClick={function () {
							return patchSaved({ patch })
						}}
						className={styles.heart}
					/>
				) : (
					<AiFillHeart
						size={35}
						// className={styles.favouritesbuttonred}
					/>
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
	)

	// Add Button functionality

	function addToCart(activity) {
		if (cart.includes(activity.id)) {
			setCart(
				cart.filter(function (id) {
					return id != activity.id
				})
			)
			console.log('Minus', cart)
			return
		} else {
			setCart([...cart, activity.id])
			console.log(`Activity:`, activity)
			console.log(`Cart:`, cart)
		}
	}
	// Sending cart funcitonality
	function sendCart() {
		if (cart.length > 1) {
			router.push({
				pathname: '/day-plan',
				query: { cart },
			})
		} else {
			alert('You have not added any activities to your day plan.')
		}
	}

	return (
		<div className={styles.main}>
			<Head>
				<title>Saunter | Results</title>
			</Head>
			<div className={styles.app}>
				<h3 className={styles.instruction}>
					Your search returned {data.length} results. Click + button that is
					displayed on the activity to save it to your day plan.{' '}
				</h3>
				<Carousel>
					{data.map((activity, index) => (
						<Card
							key={index}
							activity={activity}
							title={activity.name}
							image={activity.image}
							add={function () {
								return addToCart(activity)
							}}
							patch={{ id: activity.id }}
							liked={activity.saved}
							index={index}
						></Card>
					))}
				</Carousel>
				<div className={styles.cart}>
					{' '}
					<span className={styles.bubbleleft}></span>
					<button className='btn' onClick={sendCart}>
						See Day Plan
					</button>
					<span className={styles.bubble}>
						<p>{cart.length - 1}</p>
					</span>
				</div>
			</div>

			{/* chakra ui imported below */}
			<div className={styles.form}>
				<ChakraProvider>
					<Box
						width='15vw'
						height='100%'
						padding='6'
						borderRadius='none'
						border='2px solid'
						borderColor='black'
						mt='7.1vh'
						pt=''
						bg='#F9983F'
					>
						<FormControl>
							<FormLabel mt='1rem' fontSize='1.3rem' fontWeight='semibold'>
								Location
							</FormLabel>
							<Select
								placeholder='Select location'
								border='2px solid'
								borderColor='black'
								bg='white'
							>
								<option>London</option>
							</Select>

							<FormLabel mt='1rem' fontSize='1.3rem' fontWeight='semibold'>
								Budget
							</FormLabel>
							<Select
								placeholder='Select budget'
								border='2px solid'
								borderColor='black'
								bg='white'
								value={budget}
								onChange={(e) => setBudget(e.target.value)}
							>
								<option value='Any'>Any</option>
								<option value='1'>Low</option>
								<option value='2'>Medium</option>
								<option value='3'>High</option>
							</Select>

							<FormLabel mt='1rem' fontSize='1.3rem' fontWeight='semibold'>
								Energy level
							</FormLabel>
							<Select
								placeholder='Select energy level'
								border='2px solid'
								borderColor='black'
								bg='white'
								value={energy}
								onChange={(e) => setEnergy(e.target.value)}
							>
								<option value='Any'>Any</option>
								<option value='1'>Low</option>
								<option value='2'>Medium</option>
								<option value='3'>High</option>
							</Select>

							<FormLabel mt='1rem' fontSize='1.3rem' fontWeight='semibold'>
								Dog friendly
							</FormLabel>
							<Select
								placeholder='Select preference'
								border='2px solid'
								borderColor='black'
								bg='white'
								value={dog}
								onChange={(e) => setDog(e.target.value)}
							>
								<option value='Any'>Any</option>
								<option value='true'>Yes</option>
								<option value='false'>No</option>
							</Select>

							<FormLabel mt='1rem' fontSize='1.3rem' fontWeight='semibold'>
								Type
							</FormLabel>
							<Select
								placeholder='Select preference'
								border='2px solid'
								borderColor='black'
								bg='white'
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<option value='Any'>Any</option>
								<option value='Activity'>Activity</option>
								<option value='Art & Culture'>Art & Culture</option>
								<option value='Food & Drink'>Food & Drink</option>
								<option value='Hospitality'>Hospitality</option>
								<option value='Landmarks'>Landmarks</option>
								<option value='Parks & Gardens'>Parks & Gardens</option>
							</Select>

							<div className={styles.daybtn}>
								<button className='btn' onClick={sendingResults}>
									Update
								</button>
							</div>
						</FormControl>
					</Box>
				</ChakraProvider>
			</div>
		</div>
	)
}
