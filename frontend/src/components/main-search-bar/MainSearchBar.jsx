import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './MainSearchBar.module.scss';

const MainText = () => {
	return (
		<Row className="pb-3">
			<Col xs={12}>
				<h1>Search anything you want</h1>
			</Col>
		</Row>
	)
}

const SearchBar = (props) => {
	return (
		<Row>
			<Col xs={12}>
				<InputGroup>
					<InputGroup.Prepend>
						<InputGroup.Text id="mainSearchIcon">
							<FontAwesomeIcon icon="search"></FontAwesomeIcon>
						</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						placeholder="Search what you want to learn"
						aria-label="lerningSearchbar"
						aria-describedby="mainSearchIcon"
						onInput={(e) => props.inputChange(e.target.value)}
					/>
				</InputGroup>
			</Col>
		</Row>
	)
}

export class MainSearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: ''
		};
	}

	handleSubmit(e) {
		e.preventDefault();
	}

	handleChange(value) {
		this.setState({ searchValue: value });
	}

	render() {
		return (
			<React.Fragment>
				<div className={styles.searchContainer}>
					<MainText></MainText>
					<form onSubmit={this.handleSubmit}>
						<SearchBar inputChange={(e) => this.handleChange(e)}></SearchBar>
					</form>
				</div>
			</React.Fragment>
		)
	}
}