import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Menu = (props) => {
	const options = props.options;
	let title = props.title;

	const handleSelection = (opt) => {
		props.onSelection(opt);
	}

	const handleRemove = () => {
		props.onRemove();
	}

	return (
		<Dropdown>
			<Dropdown.Toggle variant='light'>
				{title}
			</Dropdown.Toggle>
			<DropdownMenu style={{ zIndex: 1040 }}>
				<Dropdown.Item className='text-muted' onClick={(e) => handleRemove()}>
					Remove filter
				</Dropdown.Item>
				{options.map((opt, i) =>
					<Dropdown.Item key={opt.name + '-' + i} onClick={(e) => handleSelection(opt)}>
						{opt.icon &&
							<FontAwesomeIcon icon={opt.icon} className='mr-3'></FontAwesomeIcon>
						}
						{opt.title || opt.name}
					</Dropdown.Item>
				)}
			</DropdownMenu>
		</Dropdown>
	);
}

export class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			selected: null,
			titles: {
				first: 'Filter 1',
				second: 'Filter 2'
			}
		}
	}

	componentDidMount() {
		this.setState({ list: this.props.list || [] })
	}

	handleSelection(value, type) {
		this.props.onSelection({ value, type })
		if (type === 'first') {
			this.setState({ selected: value });
		}

		const titles = Object.assign({}, this.state.titles, { [type]: value.title || value.name });

		this.setState({ titles });
	}

	handleRemove(type) {
		const titles = { ...this.state.titles };

		this.props.onRemove(type);
		if (type === 'first') {
			titles.first = 'Filter 1';
			this.setState({ selected: null });
		}

		titles.second = 'Filter 2';
		this.setState({ titles });
	}

	render() {
		const { list, selected, titles } = this.state;

		return (
			<React.Fragment>
				<Row className="pb-2">
					<Col xs={12}>
						<h4>Filter</h4>
					</Col>
				</Row>
				<Row className="pb-4">
					<Col xs={12} md={'auto'}>
						<Menu
							options={list}
							title={titles.first}
							onSelection={(e) => this.handleSelection(e, 'first')}
							onRemove={() => this.handleRemove('first')}
						></Menu>
					</Col>
					{selected &&
						<Col xs={12} md={'auto'}>
							<Menu
								options={selected.options}
								title={titles.second}
								onSelection={(e) => this.handleSelection(e, 'second')}
								onRemove={() => this.handleRemove('second')}
							>
							</Menu>
						</Col>
					}
				</Row>
			</React.Fragment>
		)
	}
}

