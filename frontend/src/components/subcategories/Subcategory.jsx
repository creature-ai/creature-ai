import React from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

export class Subcategory extends React.Component {
	render() {
		const item = this.props.item;

		return (
			<ListGroupItem action onClick={() => this.props.onClick(item)}>
				{item.label}
			</ListGroupItem>
		)
	}
}
