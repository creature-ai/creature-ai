import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Results.module.scss';
import Axios from 'axios';
import { ApiUrl } from '../../constants/api';
import { ResultsList } from './ResultsList';

export class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			isLoading: false
		}
		this.handleBack = this.handleBack.bind(this);
	}

	handleBack(e) {
		this.props.onBackClick();
	}

	async _fetchCategory(name) {
		this.setState({ isLoading: true });
		const res = await Axios.get(`${ApiUrl}/categories/${name}/results`);
		this.setState({ list: res.data, isLoading: false });
	}

	componentDidMount() {
		this._fetchCategory((this.props.selected || {}).data.name);
	}

	render() {
		const { selected, filters } = this.props;
		const { list, isLoading } = this.state;
		let resultingList = [];

		if (!filters.category && !filters.channel) {
			resultingList = list.slice();
		} else {
			resultingList = list.filter(x =>
				x.category.toLowerCase() === filters.category.toLowerCase() &&
				(
					filters.channel ?
						x.channel.toLowerCase() === filters.channel.toLowerCase() :
						true
				)
			);
		}

		const title = <h2 className="text-primary">
			<FontAwesomeIcon icon={'arrow-left'} className={styles.backIcon} onClick={this.handleBack}></FontAwesomeIcon>
			Results {resultingList.length ? '(' + resultingList.length + ')' : ''}
		</h2>;

		return (
			<div>
				<Row className="pt-4">
					<Col>
						{title}
					</Col>
				</Row>
				<Row className="pt-2 pb-2">
					<Col xs={12}>
						{selected &&
							<div>
								<p className="secondary-text mb-2">
									You selected:
								</p>
								<p className="secondary-text mb-1">
									<strong className="pl-2 pr-1">
										{selected.data.label}
									</strong>
								</p>
							</div>
						}
					</Col>
				</Row>
				<ResultsList list={resultingList} loading={isLoading}></ResultsList>
			</div>
		)
	}
}
