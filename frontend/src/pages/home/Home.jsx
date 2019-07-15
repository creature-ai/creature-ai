import React from 'react';
//import { MainSearchBar } from '../../components/main-search-bar/MainSearchBar';
import { Categories } from '../../components/categories/list/Categories';
import { Results } from '../../components/results/Results';

const spaceStyle = {
	height: '200px'
};

export class HomePage extends React.Component {
	constructor() {
		super();
		this.handleSelect = this.handleSelect.bind(this);
		this.state = {
			resultsFlag: false,
			subcategory: null
		}
	}

	componentDidMount() {
		// setTimeout(() => this.setState({ resultsFlag: true }), 2000);
	}

	handleSelect(subcategory) {
		this.setState({ subcategory });
	}

	render() {
		let resultsRender;

		if (this.state.subcategory) {
			resultsRender = <Results
				selectedSubcategorie={this.state.subcategory}
				onBackClick={() => this.setState({ subcategory: null })}
			>
			</Results>;
		}

		return (
			<React.Fragment>
				{/* <MainSearchBar></MainSearchBar> */}
				<h2>Select any category to discover new stuff to learn :D</h2>
				{!this.state.subcategory &&
					<Categories onSelect={this.handleSelect}></Categories>
				}
				{resultsRender}
				<div style={spaceStyle}></div>
			</React.Fragment >
		)
	}
}