import React from 'react';
//import { MainSearchBar } from '../../components/main-search-bar/MainSearchBar';
import { Categories } from '../../components/categories/list/Categories';
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
			subcategory: null,
			category: null,
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

	handleSelect(data) {
		this.setState(data);
	}

	render() {
		const categories = this.state.categories;
		let resultsRender;

		if (this.state.subcategory) {
			resultsRender = <Results
				category={this.state.category}
				subcategory={this.state.subcategory}
				onBackClick={() => this.setState({ subcategory: null })}
			>
			</Results>;
		}

		return (
			<React.Fragment>
				{/* <MainSearchBar></MainSearchBar> */}
				{!this.state.subcategory &&
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