import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { LoaderSpinner } from '../../shared/LoaderSpinner';

const ListItem = (props) => {
	const item = props.item;

	return (
		<Card className="m-2">
			<Card.Body>
				<a href={item.url} target={'_blank'}>
					<Card.Title>
						{item.title}
					</Card.Title>
				</a>
				<Card.Text>
					{item.description}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}

export class ResultsList extends React.Component {
	render() {
		if (this.props.loading) {
			return (
				<LoaderSpinner show></LoaderSpinner>
			)
		} else {
			if (this.props.list.length) {
				const list = this.props.list.map((item, idx) =>
					<Col xs={12} key={idx + '-' + item.title}>
						<ListItem item={item}></ListItem>
					</Col>
				);

				return (
					<Row>
						{list}
					</Row>
				)
			} else {
				return (
					<Row>
						<Col xs={12} className="text-center">
							<h4 className="text-muted">
								No results found
						</h4>
						</Col>
					</Row>
				)
			}
		}
	}
}