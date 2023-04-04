import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/future/image';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import page2image from '../public/assets/inputpageimage.avif';
import page2image2 from '../public/assets/inputimage2.avif';
import page2image3 from '../public/assets/inputimage3.avif';

import {
	Box,
	ChakraProvider,
	FormControl,
	FormLabel,
	Select,
} from '@chakra-ui/react';
import styles from '../styles/Inputpage.module.css';

export default function GetStarted() {
	const [budget, setBudget] = useState('Any')
	const [energy, setEnergy] = useState('Any')
	const [dog, setDog] = useState('Any')
	const [type, setType] = useState('Any')

	const router = useRouter()

	function sendingResults() {
		let selectedLocation = 'London'
		let selectedBudget = budget
		let selectedEnergy = energy
		let selectedDog = dog
		let selectedType = type
		router.push({
			pathname: `/results`,
			query: { selectedLocation, selectedBudget, selectedEnergy, selectedDog, selectedType },
		})
	}

	return (
		<div className={styles.get_started__container}>
			<Head>
				<title>Saunter | Get-Started</title>
			</Head>
			<Image
				className={styles.pagetwoimg}
				src={page2image}
				alt='inputpage image'
				style={{ transform: 'rotate(-13.23deg)' }}
			/>
			<Image
				className={styles.pagetwoimg2}
				src={page2image2}
				alt='Second Input Image'
			/>
			<Image
				className={styles.pagetwoimg3}
				src={page2image3}
				style={{ transform: 'rotate(64.35deg)' }}
				alt='Third Input Image'
			/>

			<div className={styles.form}>
				<ChakraProvider>
					<Box
						width={{ base: '50vh', md: '50vh', lg: '68vh' }}
						mb='10vh'
						borderColor='black'
						borderStyle='solid'
						borderWidth='4px'
						padding='6'
						borderRadius='2rem'
						boxShadow='10px 10px black'
						backgroundColor='white'
					>
						<FormControl>
							<FormLabel fontSize='1.3rem' pt='1rem' fontWeight= 'semibold'>
								Where do you want to travel to?
							</FormLabel>
							<Select placeholder='Select location'>
								<option>London</option>
							</Select>

							<FormLabel
								className={styles.budgetquestion}
								data-hover='low is £5-£25, medium is £25-£50, high is £50+'
								fontSize='1.3rem'
								pt='1rem'
                fontWeight= 'semibold'
							>
								What is your budget? <AiOutlineQuestionCircle />
							</FormLabel>

							<Select
								placeholder='Select budget'
								value={budget}
								fill='white'
								onChange={(e) => setBudget(e.target.value)}
							>
								<option selected value='Any'>
									Any
								</option>
								<option value='1'>Low</option>
								<option value='2'>Medium</option>
								<option value='3'>High</option>
							</Select>

							<FormLabel
								className={styles.energyquestion}
								data-hover='low is relaxing, medium is leisurely saunter, high is active & fast paced'
								fontSize='1.3rem'
								pt='1rem'
                fontWeight= 'semibold'
							>
								What is your energy level? <AiOutlineQuestionCircle />
							</FormLabel>
							<Select
								placeholder='Select energy level'
								value={energy}
								onChange={(e) => setEnergy(e.target.value)}
							>
								<option selected value='Any'>
									Any
								</option>
								<option value='1'>Low</option>
								<option value='2'>Medium</option>
								<option value='3'>High</option>
							</Select>

							<FormLabel fontSize='1.3rem' pt='1rem' fontWeight= 'semibold'>
								Would you prefer a dog friendly activity?
							</FormLabel>
							<Select
								placeholder='Select preference'
								value={dog}
								onChange={(e) => setDog(e.target.value)}
							>
								<option selected value='Any'>
									Any
								</option>
								<option value='true'>Yes</option>
								<option value='false'>No</option>
							</Select>

							<FormLabel fontSize='1.3rem' pt='1rem' fontWeight= 'semibold'>
								What type of activity are you looking for?
							</FormLabel>
							<Select
								placeholder='Select preference'
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<option selected value='Any'>
									Any
								</option>
								<option value='Activity'>Activity</option>
								<option value='Art & Culture'>Art & Culture</option>
								<option value='Food & Drink'>Food & Drink</option>
								<option value='Hospitality'>Hospitality</option>
								<option value='Landmarks'>Landmarks</option>
								<option value='Parks & Gardens'>Parks & Gardens</option>
							</Select>

							<div className={styles.button}>
								<button className='btn' onClick={sendingResults}>
									Search
								</button>
							</div>
						</FormControl>
					</Box>
				</ChakraProvider>
			</div>
			<div className={styles.bottomdiv}></div>
		</div>
	)
}
