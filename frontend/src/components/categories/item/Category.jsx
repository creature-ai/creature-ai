import React from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../Categories.module.scss';
import { Subcategories } from '../subcategories/list/Subcategories';

class ListItem extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		this.props.onClick(e);
	}

	render() {
		const item = this.props.item;

		return (
			<ListGroupItem action className="mb-2" onClick={this.handleClick}>
				<FontAwesomeIcon icon={item.icon} className="mr-4 itemIcon"></FontAwesomeIcon>
				<h5 className="m-0 d-inline-block">
					{item.title}
				</h5>
				{item.subcategories.length > 0 &&
					<FontAwesomeIcon icon={'chevron-right'} className="float-right mt-1 text-muted"></FontAwesomeIcon>
				}
			</ListGroupItem>
		)
	}
}

export class Category extends React.Component {
	handleSelection(e) {
		this.props.onSelection({ category: this.props.item, subcategory: e });
	}

	render() {
		const item = this.props.item;

		return (
			<div className={styles.categoryItem}>
				<Dropdown drop={'right'}>
					<Dropdown.Toggle as={ListItem} item={item}></Dropdown.Toggle>
					{item.subcategories.length > 0 &&
						<Dropdown.Menu>
							<Subcategories list={item.subcategories} onSelection={(e) => this.handleSelection(e)}></Subcategories>
						</Dropdown.Menu>
					}
				</Dropdown>
			</div>
		)
	}
}