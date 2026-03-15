import { NavLink, useNavigate } from 'react-router'
import { useAuth } from './auth/AuthContext'
import { useEffect } from 'react'

const App = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

	useEffect(() => {
		if (user) navigate('/home')
	}, [user, navigate])

	return (
		<div className="landing-hero">
		<p className="landing-hero__eyebrow">Welcome to</p>
		<h1 className="landing-hero__title">
			Dungeon<span className="accent">NoDragon</span>
		</h1>
		<p className="landing-hero__subtitle">
			Enter the maze. Defeat the goblins. Be the first one escaping.
		</p>
		<div className="landing-hero__actions">
			<NavLink to="/login" className="button is-ghost is-medium">Sign in</NavLink>
			<NavLink to="/register" className="button is-primary is-medium">Sign up</NavLink>
		</div>
		</div>
	)
}

export default App