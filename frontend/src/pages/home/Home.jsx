import React from 'react';
//import { MainSearchBar } from '../../components/main-search-bar/MainSearchBar';
import { Categories } from '../../components/categories/Categories';
import { Results } from '../../components/results/Results';
import axios from 'axios';
import { ApiUrl } from '../../constants/api';

const spaceStyle = {
	height: '200px'
};

export class HomePage extends React.Component {
	constructor() {
		super();
		this.handleSelect = this.handleSelect.bind(this);
		this.state = {
			resultsFlag: false,
			selected: null,
			categories: []
		}
	}

	componentDidMount() {
		this._fetchCategories();
	}

	async _fetchCategories() {
		const categories = await axios.get(`${ApiUrl}/categories`);
		this.setState({ categories: categories.data });
	}

	handleSelect(value) {
		this.setState({ selected: value });
	}

	render() {
		const categories = this.state.categories;
		let resultsRender;

		if (this.state.selected) {
			resultsRender = <Results
				selected={this.state.selected}
				onBackClick={() => this.setState({ selected: null })}
			>
			</Results>;
		}

		return (
			<React.Fragment>
				{/* <MainSearchBar></MainSearchBar> */}
				{!this.state.selected &&
					<React.Fragment>
						<h2>Select any category to discover new stuff to learn :D</h2>
						<Categories list={categories} onSelect={this.handleSelect}></Categories>
					</React.Fragment>
				}
				{resultsRender}
				<div style={spaceStyle}></div>
			</React.Fragment>
		)
	}
}