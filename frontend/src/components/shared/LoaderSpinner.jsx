import React from 'react'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LoaderSpinner = (props) => {
	if (!props.show) {
		return null;
	}

	const style = {
		fontSize: '30px'
	}

	return (
		<Row>
			<Col xs={12} className="text-center text-info">
				<FontAwesomeIcon icon={'spinner'} spin style={style}></FontAwesomeIcon>
			</Col>
		</Row>
	)
}