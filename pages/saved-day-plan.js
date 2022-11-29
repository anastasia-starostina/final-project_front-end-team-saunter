import styles from '../styles/dayplan.module.css'

import Head from 'next/head'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import { FiMapPin } from 'react-icons/fi'
import { IconContext } from 'react-icons'

export default function DayPlan() {
	const [dayPlan, setDayPlan] = useState([])

	const router = useRouter()
	const { query } = router.query
	console.log(`This is the query:`, query)

	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
        `https://saunter-db-p2f8.onrender.com/all-budgets`
      );
			let allActivities = response.data.data
			let filteredActivities = []
			const queryIDs = query.split(',')
			console.log('QueryIDs', queryIDs)
			for (let i = 1; i < queryIDs.length; i++) {
				let activityId = queryIDs[i]
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

	const Card = ({ name, type, description, image, map }) => {
		return (
			<div className={styles.activity}>
			<div className={styles.card}>
				<div className={styles.title}>
					<h2 className={styles.card_title}>{name}</h2>
				</div>
				<div className={styles.image_container}>
					<img src={image} alt={name} className={styles.card_image} />
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
				<title>Saunter | Saved Day Plan</title>
			</Head>
			<div className={styles.headingcard}>
				<h1 className={styles.text}>Your saved day plan:</h1>

			</div>
			<div className={styles.all_cards}>
				{dayPlan.map((activity, index) => (
					<Card
						key={index}
						name={activity.name}
						type={activity.type}
						description={activity.description}
						image={activity.image}
						map={activity.map}
					/>
				))}
			</div>
		</div>
	)
}

