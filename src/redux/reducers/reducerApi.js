import { TOP_TOURS, TOUR, TOURS } from "../types";

const initialState = {
	tours: [],
	tour: {},
	topTours: [],
};

export const reducerApi = (state = initialState, action) => {
	switch (action.type) {
		case TOURS:
			return { ...state, tours: action.payload };
		case TOUR:
			return { ...state, tour: action.payload };
		case TOP_TOURS:
			return { ...state, topTours: action.payload };

		default:
			return state;
	}
};