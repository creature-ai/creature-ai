import React from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Categories.module.scss';
import { Subcategories } from '../subcategories/Subcategories';

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
			<ListGroupItem
				action
				className="mb-2"
				onClick={this.handleClick}
				onMouseOver={(e) => this.props.onMouseOver(e)}
			>
				<FontAwesomeIcon icon={item.icon} className="mr-4 itemIcon"></FontAwesomeIcon>
				<h5 className="m-0 d-inline-block">
					{item.label}
				</h5>
				{item.subcategories.length > 0 &&
					<FontAwesomeIcon icon={'chevron-right'} className="float-right mt-1 text-muted"></FontAwesomeIcon>
				}
			</ListGroupItem>
		)
	}
}

export class Category extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		};
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleSelection(e) {
		e.preventDefault();
		this.props.onSelection({ data: this.props.item, type: 'category' });
	}

	handleSubcategorySelection(e) {
		this.props.onSelection({ data: e, type: 'subcategory' })
	}

	handleOpen(e) {
		this.setState({ isOpen: true });
	}

	handleClose(e) {
		this.setState({ isOpen: false });
	}

	render() {
		const { item } = this.props;
		let { isOpen } = this.state;

		return (
			<div className={styles.categoryItem}>
				<Dropdown drop={'right'}>
					<Dropdown.Toggle as={ListItem} item={item} onMouseOver={this.handleOpen} onClick={(e) => this.handleSelection(e)} onMouseLeave={(e) => this.props.onLeave(item)}></Dropdown.Toggle>
					{item.subcategories.length > 0 &&
						<Dropdown.Menu show={isOpen}>
							<Subcategories list={item.subcategories} onSelection={(e) => this.handleSubcategorySelection(e)} onMouseLeave={this.handleClose}></Subcategories>
						</Dropdown.Menu>
					}
				</Dropdown>
			</div>
		)
	}
}