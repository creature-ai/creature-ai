import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { Category } from '../item/Category';

export class Categories extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubcategorySelection = this.handleSubcategorySelection.bind(this);
		this.state = {
			list: [],
			isLoading: true,
			subcategory: null
		};
	}

	componentDidMount() {
		this._fetch();
	}

	async _fetch() {
		this.setState({ isLoading: true })
		const categories = await axios.get('http://localhost:4000/categories');
		this.setState({ list: categories.data, isLoading: false });
	}

	handleSubcategorySelection(subcategory) {
		this.setState({ subcategory });
		this.props.onSelect(subcategory);
	}

	render() {
		const title = <h2 className="text-primary">Categories</h2>;
		const list = this.state.list.map(item =>
			<React.Fragment key={item.id}>
				<Category item={item} onSelection={this.handleSubcategorySelection}></Category>
			</React.Fragment>
		);

		return (
			<div>
				<Row className="pt-4">
					<Col>
						{title}
					</Col>
				</Row>
				<Row className="pt-2">
					<Col xs={8}>
						<ListGroup>
							{list}
						</ListGroup>
					</Col>
				</Row>
			</div>
		)
	}
}