import styles from '../styles/dayplan.module.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { FiMapPin } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { useUser } from '@auth0/nextjs-auth0'

export default function DayPlan() {
	//Auth0 start
	const { user, error, isLoading } = useUser()
	console.log(user)

	//Auth0 end --

	const [dayPlan, setDayPlan] = useState([])
	const router = useRouter()
	const { cart } = router.query
	console.log(`This is your cart:`, cart)


	const postDayplan = async (input) => {
		const response = await fetch(
      `https://saunter-server.onrender.com/dayplans`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Method": "POST",
        },
        body: JSON.stringify(input),
      }
    );
	}


	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
        `https://saunter-server.onrender.com/all-budgets`
      );
			let allActivities = response.data.data
			let filteredActivities = []
			for (let i = 0; i < cart.length; i++) {
				let activityId = cart[i]
				for (let i = 0; i < allActivities.length; i++) {
					if (allActivities[i].id == activityId) {
						filteredActivities.push(allActivities[i])
					}
				}
			}
			setDayPlan(filteredActivities)
			console.log(`your filtered activities:`, filteredActivities)
		}
		getData()
	}, [])

	const Card = ({ title, image, description, map, type }) => {
		return (
			<div className={styles.activity}>
				<div className={styles.card}>
					<div className={styles.title}>
						<h2 className={styles.card_title}>{title}</h2>
					</div>
					<div className={styles.image_container}>
						<img src={image} alt={title} className={styles.card_image} />
					</div>
				</div>
				<div className={styles.text_container}>
					<div className={styles.type_container}>
						<h2>{type}</h2>
					</div>
					<p>{description}</p>
					<div className={styles.iconbar}>
						<div className={styles.icon}>
							<IconContext.Provider value={{ color: 'black', size: '1.5rem' }}>
								<div className={styles.maplink2}>
									<FiMapPin />
									<a
										className={styles.maplink}
										href={map}
										target='_blank'
										rel='noreferrer'
									>
										View on Google Maps
									</a>
								</div>
							</IconContext.Provider>
						</div>
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className={styles.dayplan}>
			<Head>
				<title>Saunter | Day Plan</title>
			</Head>
			<div className={styles.headingcard}>
				<h1 className={styles.text}>Your perfect day plan looks like this:</h1>
			</div>
			<div className={styles.all_cards}>
				{dayPlan.map((activity, index) => (
					<Card
						key={index}
						title={activity.name}
						type={activity.type}
						description={activity.description}
						image={activity.image}
						map={activity.map}
					/>
				))}
			</div>


			<div className={styles.button_dayplan}>
				{user && (
					<button
						className='btn'
						onClick={function () {
							const dayplanName = prompt('Name your day plan:')

							const body = { name: dayplanName, activities: cart.toString() }
							console.log(body)
							return postDayplan(body)
						}}
					>
						Save Day Plan
					</button>
				)}
		

			</div>
		</div>
	)
}
