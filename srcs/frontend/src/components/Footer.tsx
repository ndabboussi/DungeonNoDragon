import { Footer, Content } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';
import "./ui/parchment.css";

const MyFooter = () => {
	return (
		<Footer className="my-footer">
			<img src="../assets/parchment-left.svg" />
			<div id="parchment-center">
				<div className='parchment-text'>
					<Content textAlign="centered" style={{marginTop: 'auto'}}>
						<p>
						<strong>DungeonNoDragon</strong> a transcendence project by{' '}
						<strong><a href="">agruet</a></strong>{', '}
						<strong><a href="">jumichel</a></strong>{', '}
						<strong><a href="">mprokosc</a></strong>{', '}
						<strong><a href="">ndabbous</a></strong>{', '}
						<strong><a href="">tpinton</a></strong>.
						</p>
					</Content>
					<Content textAlign="centered">
						<p>
							Find out about our{' '}
							<NavLink to="/privacy_policy" aria-label='Privacy Policy link'>
								<strong>Privacy Policy</strong>
							</NavLink>{' and '}
							<NavLink to="/terms_of_service" aria-label='Terms of Service link'>
								<strong>Terms of Service</strong>
								</NavLink>.
						</p>
					</Content>
					<Content textAlign="centered" style={{marginBottom: 'auto'}}>
						<p>
							@2026 Piscine of July 2024 Team
						</p>
					</Content>
				</div>
			</div>
			<img src="../assets/parchment-right.svg" />
		</Footer>
	)
}

export default MyFooter
