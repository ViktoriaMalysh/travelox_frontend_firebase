import styles from "./TourCard.module.scss";
import { Link } from "react-router-dom";
import {
	Button,
	Divider,
	Grid,
	Icon,
	Image,
	Rating,
	Segment,
} from "semantic-ui-react";

const TourCard = ({ item, onChange }) => {
	console.log("item", item);
	return (
		<Segment raised className={styles.topTourSegment}>
			<div className={styles.topTourSegmentDivImg}>
				<img src={item.imgUrl} className={styles.topTourSegmentImg} />
			</div>
			<Grid className={styles.topTourSegmentBlock} divided>
				<Grid.Row columns={3}>
					<Grid.Column width={5}>
						<Icon name="clock outline" /> {item.countOfDays}D/
						{item.countOfDays - 1}N
					</Grid.Column>

					<Grid.Column width={6}>
						<Icon name="users" /> {item.countOfPerson} Person
					</Grid.Column>

					<Grid.Column width={5}>
						<Icon name="map marker alternate" /> {item.country}
					</Grid.Column>
				</Grid.Row>
			</Grid>

			<Link to={"/"}>
				<h5>{item.name}</h5>
			</Link>
			<div className={styles.topTourSegmentDiv}>
				<Rating
					defaultRating={item.rate}
					maxRating={5}
					size="small"
					icon="star"
					disabled
					className={styles.topTourSegmentRating}
				/>{" "}
				<span>({item.reviews} Reviews)</span>
			</div>
			<Divider className={styles.topTourSegmentDevider} />
			<div>
				<div className={styles.topTourSegmentDiv}>
					${item.price}
					<span>/per person</span>
				</div>
				<Button>
					Book now <Icon name="arrow right" />
				</Button>
			</div>
		</Segment>
	);
};

export default TourCard;