import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Results.module.scss';

export class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: []
		}
		this.handleBack = this.handleBack.bind(this);
	}

	handleBack(e) {
		this.props.onBackClick();
	}

	render() {
		const title = <h2 className="text-primary">
			<FontAwesomeIcon icon={'arrow-left'} className={styles.backIcon} onClick={this.handleBack}></FontAwesomeIcon> Results
		</h2>;
		const selected = this.props.selectedSubcategorie;

		return (
			<div>
				<Row className="pt-4">
					<Col>
						{title}
					</Col>
				</Row>
				<Row className="pt-2">
					<Col xs={12}>
						{selected &&
							<p className="secondary-text">
								You selected:
								<strong className="pl-2">
									{selected.name}
								</strong>
							</p>
						}
					</Col>
				</Row>
			</div>
		)
	}
}
