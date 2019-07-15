import React from 'react';
import { MainSearchBar } from '../../components/main-search-bar/MainSearchBar';
import { Categories } from '../../components/categories/list/Categories';
import { Results } from '../../components/results/Results';

const spaceStyle = {
	height: '200px'
};

export class HomePage extends React.Component {
	constructor() {
		super();
		this.state = {
			resultsFlag: false
		}
	}

	componentDidMount() {
		// setTimeout(() => this.setState({ resultsFlag: true }), 2000);
	}

	render() {
		let resultsRender;

		if (this.state.resultsFlag) {
			resultsRender = <Results></Results>;
		}

		return (
			<React.Fragment>
				<MainSearchBar></MainSearchBar>
				<Categories></Categories>
				{resultsRender}
				<div style={spaceStyle}></div>
			</React.Fragment>
		)
	}
}