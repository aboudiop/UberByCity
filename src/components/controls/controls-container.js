import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import assign from 'object-assign';
import _ from 'underscore';
import Controls from './controls-view';

// Actions
import * as chartActions from '../../actions/chart-actions';
import * as cityActions from '../../actions/city-list-actions';

@connect(state => state.chart)
export default class ChartContainer extends Component {
	constructor(props) {
		super(props);
		const actionCreators = assign({}, chartActions, cityActions);
		this.actions = bindActionCreators(actionCreators, this.props.dispatch);
	}

	static propTypes = {
		compare: PropTypes.string.isRequired,
		cities: PropTypes.array.isRequired,
		graphData: PropTypes.array.isRequired,
		displayProduct: PropTypes.string.isRequired,
		cityError: PropTypes.bool.isRequired,
	    erroredCities: PropTypes.array.isRequired,
	    citiesOnChart: PropTypes.array.isRequired,
	    refreshTime: PropTypes.string.isRequired,
	    countdown: PropTypes.number.isRequired,
	}

	componentDidMount() {
		this.refreshData();
	}

	componentDidUpdate(prevProps) {
		if(this.props.countdown === 0) {
			this.actions.requestData({
				compare: this.props.compare,
				cities: this.props.cities,
				refreshTime: new Date().toLocaleTimeString(),
			});
		} else if(prevProps.compare !== this.props.compare ||
			prevProps.displayProduct !== this.props.displayProduct) {
			this.refreshData();
		}
	}

	refreshData = () => {
		this.actions.requestData({
			compare: this.props.compare,
			cities: this.props.cities,
		});
	}

	requestNewAirport = (city) => {
		const newCities = [].concat(this.props.cities);
		const currentCity = _.findWhere(newCities, {name: city});
		currentCity.index = (currentCity.index + 1) % currentCity.airports.length;

		this.actions.requestData({
			cities: [currentCity],
			compare: this.props.compare,
		});
	}

	addCity = (city) => {
		if(!_.findWhere(this.props.cities, {name: city})) {
			const cities = [
				{
					name: city,
					index: 0,
				},
			];
			this.actions.requestData({
				compare: this.props.compare,
				cities,
			});
		} else {
			this.actions.dataError(city);
		}
		
	}

	render = () => {
		return (
			<Controls 
				addCity={this.addCity}
				removeCity={this.actions.removeCity}
				countdownTick={this.actions.countdownTick}
				changeDisplayProduct={this.actions.changeDisplayProduct}
				changeComparison={this.actions.changeComparison}
				requestNewAirport={this.requestNewAirport}
				{...this.props}
			/>
		);
	}

}