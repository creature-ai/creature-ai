import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { LoaderSpinner } from '../shared/LoaderSpinner';
import styles from './Results.module.scss';

class ListItem extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {
			isOpen: false,
			height: 0,
			maxHeight: 150
		}
		this.textElem = null;
	}

	handleClick(e) {
		this.setState({ isOpen: !this.state.isOpen });
	}

	componentDidMount() {
		if (this.textElem) {
			this.setState({ height: this.textElem.clientHeight })
		}
	}

	render() {
		const { item } = this.props;
		let { isOpen, height, maxHeight } = this.state;
		const src = ((item.steps.find(step => step.step_imgs.length > 0) || { step_imgs: [] }).step_imgs[0] || '')

		return (
			<Card className="m-2">
				<Row noGutters>
					{src && src.indexOf('http') > -1 &&
						<Col xs={12} md={4} className={styles.cardImgContainer + (isOpen ? ' ' + styles.open : '')}>
							<Card.Img
								src={src}
								alt='Image'
								className={styles.cardImg}
							/>
						</Col>
					}
					<Col xs={12} md={src && src.indexOf('http') > -1 ? 8 : 12}>
						<Card.Body>
							<a href={item.url} target={'_blank'}>
								<Card.Title>
									{item.title}
								</Card.Title>
							</a>
							<div className={styles.desc + (isOpen ? ' ' + styles.open : '')}>
								<Card.Text
									ref={(elem) => this.textElem = elem}
								>
									{item.description}
								</Card.Text>
							</div>
						</Card.Body>
						{height > maxHeight &&
							<Card.Footer className="text-right">
								<Button variant="primary" onClick={this.handleClick}>
									{isOpen ? 'Less' : 'More...'}
								</Button>
							</Card.Footer>
						}
					</Col>
				</Row>
			</Card>
		)
	}
}

export class ResultsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filters: []
		}
	}

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