import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Subcategory } from '../item/Subcategory';
import styles from '../Subcategories.module.scss';

export class Subcategories extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		this.props.onSelection(e);
	}

	render() {
		const list = this.props.list;

		return (
			<div className={'bg-white ' + styles.scrollCard}>
				<ListGroup variant={'flush'}>
					{list.map(item =>
						<Subcategory item={item} key={item.name} onClick={this.handleClick}></Subcategory>
					)}
				</ListGroup>
			</div>
		)
	}
}
