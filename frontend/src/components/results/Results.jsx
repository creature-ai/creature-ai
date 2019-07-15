import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: []
		}
	}

	render() {
		const title = <h2 className="text-primary">Results</h2>;;

		return (
			<div>
				<Row className="pt-4">
					<Col>
						{title}
					</Col>
				</Row>
				<Row className="pt-2">
					<Col xs={12}>
					</Col>
				</Row>
			</div>
		)
	}
}
