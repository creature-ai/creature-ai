import React from 'react';
import { Route } from 'react-router-dom';
import { HomePage } from '../../pages/home/Home';
import NavBar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { names } from '../../constants';
import styles from './FullLayout.module.scss';

export class FullLayoutTemplate extends React.Component {
	constructor() {
		super();
		this.state = {
			appName: names.appName
		}
	}

	render() {
		return (
			<React.Fragment>
				<NavBar bg="light" fixed="top" expand="lg">
					<Container>
						<NavBar.Brand>
							{this.state.appName}
						</NavBar.Brand>
					</Container>
				</NavBar>
				<div className={styles.navbarSpace}></div>
				<Container className="pt-5">
					<Route exact path="/" component={HomePage} />
				</Container>
			</React.Fragment>
		)
	}
}