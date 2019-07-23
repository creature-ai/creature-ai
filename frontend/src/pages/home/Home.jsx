import React from 'react';
//import { MainSearchBar } from '../../components/main-search-bar/MainSearchBar';
import { Categories } from '../../components/categories/Categories';
import { Results } from '../../components/results/Results';
import axios from 'axios';
import { ApiUrl } from '../../constants/api';
import { Filters } from '../../components/filters/Filters';

const spaceStyle = {
	height: '200px'
};

export class HomePage extends React.Component {
	constructor() {
		super();
		this.handleSelect = this.handleSelect.bind(this);
		this.handleFilterSelection = this.handleFilterSelection.bind(this);
		this.handleFilterRemove = this.handleFilterRemove.bind(this);
		this.state = {
			resultsFlag: false,
			selected: null,
			categories: [],
			filtersList: [],
			filters: {
				category: null,
				channel: null
			}
		}
	}

	componentDidMount() {
		this._fetchCategories();
		this._fetchFiltersList()
	}

	async _fetchCategories() {
		const res = await axios.get(`${ApiUrl}/categories`);
		this.setState({ categories: res.data });
	}

	async _fetchFiltersList() {
		const res = await axios.get(`${ApiUrl}/filters`);
		this.setState({ filtersList: res.data });
	}

	handleSelect(value) {
		this.setState({ selected: value });
	}

	handleFilterSelection(e) {
		const filters = Object.assign({}, this.state.filters);

		if (e.type === 'first') {
			filters.category = e.value.name;
		} else if (e.type === 'second') {
			filters.channel = e.value.name;
		}

		this.setState({ filters });
	}

	handleFilterRemove(type) {
		const filters = Object.assign({}, this.state.filters);

		if (type === 'first') {
			filters.category = null;
		}

		filters.channel = null;
		this.setState({ filters })
	}

	render() {
		const { categories, filtersList, filters, selected } = this.state;
		let resultsRender;

		if (selected) {
			resultsRender = <React.Fragment>
				<Filters
					list={filtersList}
					onSelection={this.handleFilterSelection}
					onRemove={this.handleFilterRemove}
				></Filters>
				<Results
					selected={selected}
					filters={filters}
					onBackClick={() => this.setState({ selected: null })}
				></Results>
			</React.Fragment>;
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