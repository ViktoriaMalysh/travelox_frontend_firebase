import {
    Button,
    Checkbox,
    Dimmer,
    Dropdown,
    Form,
    Grid,
    Icon,
    Input,
    Loader,
    Rating,
    Segment,
} from "semantic-ui-react";
import {
    accommodationTypes,
    rating,
    sortOptions,
    topTours,
} from "../../Backend/Data";
import Breadcrumb from "../../Common/Breadcrumb/Breadcrumb";
import Footer from "../../Common/Footer/Footer";
import PriceRange from "../../Common/Price Range/PriceRange";
import dayjs from "dayjs";
import styles from "./TourPackage.module.scss";
import TourCard from "../../Common/Tour Card/TourCard";
import CustomPagination from "../../Common/Pagination/Pagination";
import { useEffect, useState } from "react";
import Banner from "../../Common/Banner/Banner";
import { useDispatch, useSelector } from "react-redux";
import { getTours } from "../../redux/actions/actionApi";
import CalendarContainer from "../../Common/Calendar/Calendar";
import "../../Common/Calendar/Calendar.scss";
import _ from "lodash";
import { CLEAR_TOURS } from "../../redux/types";
import { useNavigate } from "react-router-dom";

const TourPackage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const itemsPerPage = 6;

    //store
    const store = useSelector((state) => state);
    const tours = useSelector((state) => state.api.tours);
    const destinations = useSelector((state) => state.api.destinations);

    const type = new URLSearchParams(window.location.search).get("type");

    //useState
    const [pageCount, setPageCount] = useState(8);
    const [minVal, setMinVal] = useState(100);
    const [maxVal, setMaxVal] = useState(150);
    const [selectedTypes, setSelectedType] = useState({
        type: { checked: true, value: type },
    }); //
    const [currentItems, setCurrentItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [openCalendar, setOpenCalendar] = useState([
        {
            key: "check-in",
            open: false,
            date: new URLSearchParams(window.location.search).get("checkIn")
                ? new URLSearchParams(window.location.search).get("checkIn")
                : dayjs(new Date()).format("YYYY-MM-DD"),
        },
        {
            key: "check-out",
            open: false,
            date: new URLSearchParams(window.location.search).get("checkOut")
                ? new URLSearchParams(window.location.search).get("checkOut")
                : dayjs(new Date("2023-01-25")).format("YYYY-MM-DD"),
        },
    ]);
    
    const destinationName = new URLSearchParams(window.location.search).get(
        "destination"
    )
        ? new URLSearchParams(window.location.search).get("destination")
        : "country";

    const [search, setSearch] = useState({
        destination: new URLSearchParams(window.location.search).get(
            "destinationCode"
        )
            ? new URLSearchParams(window.location.search).get("destinationCode")
            : "en_US",
        adults: new URLSearchParams(window.location.search).get("adults")
            ? new URLSearchParams(window.location.search).get("type")
            : 1,
        accommodationType: new URLSearchParams(window.location.search).get(
            "type"
        )
            ? new URLSearchParams(window.location.search).get("type")
            : "",
        starRating: new URLSearchParams(window.location.search).get(
            "starRating"
        )
            ? new URLSearchParams(window.location.search).get("starRating")
            : 5,
    });

    // useEffect(() => {
    // if (destinations.length) {
    // 	setSearch({
    // 		adults: 1,
    // 		destination: destinations[0].key,
    // 		accommodationType: [accommodationTypes[0].value],
    // 	});
    // }
    // }, [destinations]);

    console.log("[search]:", search, search.accommodationType);

    useEffect(() => {
        if (!tours.length) {
            const options = {
                currency: localStorage.getItem("currency"),
                eapid: 1,
                locale: search.destination,
                siteId: 300000001, //
                destination: {
                    regionId: "6054439", //
                },
                checkInDate: {
                    day: Number(dayjs(openCalendar[0].date).format("DD")),
                    month: Number(dayjs(openCalendar[0].date).format("M")),
                    year: Number(dayjs(openCalendar[0].date).format("YYYY")),
                },
                checkOutDate: {
                    day: Number(dayjs(openCalendar[1].date).format("DD")),
                    month: Number(dayjs(openCalendar[1].date).format("M")),
                    year: Number(dayjs(openCalendar[1].date).format("YYYY")),
                },
                rooms: [
                    {
                        adults: Number(search.adults),
                    },
                ],
                resultsStartingIndex: 0,
                resultsSize: 200,
                sort: "PRICE_LOW_TO_HIGH",
                filters: {
                    price: {
                        min: minVal,
                        max: Math.round(maxVal),
                    },
                    star: [String(search.starRating * 10)],
                    // lodging: search.accommodationType,
                },
            };
            JSON.stringify(options);
            dispatch(getTours(options)).then(console.log("[Success!]"));
        } else console.log("search");
    }, []);

    const handleSearch = () => {
        dispatch({ type: CLEAR_TOURS });

        let accommodationIds = _.chain(selectedTypes)
            .filter("checked")
            .mapValues("value")
            .values()
            .value();

        console.log(accommodationIds);

        const option = {
            destination: search.destination,
            checkIn: openCalendar[0].date,
            checkOut: openCalendar[1].date,
            type: accommodationIds,
            adults: search.adults,
            starRating: search.starRating,
        };
        navigate("/tour-package?" + new URLSearchParams(option).toString());

        console.log("search!!!    ");
    };

    const handleClose = (key) => {
        setOpenCalendar(
            openCalendar.map((item) => {
                if (item.key === key) {
                    item.open = !item.open;
                }
                return item;
            })
        );
    };

    const handleSetDate = (key, date) => {
        setOpenCalendar(
            openCalendar.map((item) => {
                if (item.key === key) {
                    item.date = dayjs(date).format("YYYY-MM-DD");
                }
                return item;
            })
        );
    };

    const myHandleChangeCheck = (data, type) => {
        const formattedType = _.snakeCase(type);
        setSelectedType((prevSeletedType) => {
            return {
                ...prevSeletedType,
                [formattedType]: {
                    ...prevSeletedType[formattedType],

                    checked: data.checked,
                    value: data.value.value,
                },
            };
        });
    };

    useEffect(() => {
        if (tours.length) {
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(tours?.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(tours?.length / itemsPerPage));
        }
    }, [itemOffset, itemsPerPage, tours]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % tours?.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <Breadcrumb title="Tour package" link="tour package" />

            <Grid className={styles.tourPackage}>
                <Grid.Row>
                    <Grid.Column floated="left" width={4}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Segment
                                        raised
                                        className={
                                            styles.tourPackageSegmentLeft
                                        }
                                    >
                                        <h4>Search tours</h4>
                                        {/* <Form> */}
                                        <Form.Field
                                            className={
                                                styles.tourPackageFormField
                                            }
                                        >
                                            <label>Destination</label>

                                            <Dropdown
                                                selection
                                                label="Travel Type"
                                                // placeholder={destinations.length ? destinations[0].value : null}
                                                options={destinations}
                                                defaultValue={
                                                    search.destination
                                                }
                                                value={search.destination}
                                                onChange={(e, data) => {
                                                    destinations.map((item) => {
                                                        if (
                                                            item.value ===
                                                            data.value
                                                        ) {
                                                            setSearch({
                                                                ...search,
                                                                destination:
                                                                    item.key,
                                                            });
                                                        }
                                                    });
                                                }}
                                                className={
                                                    styles.tourPackageAreaSelect
                                                }
                                            />
                                        </Form.Field>
                                        <Form.Field
                                            className={
                                                styles.tourPackageFormField
                                            }
                                        >
                                            <div>
                                                <div>
                                                    <label>Check In</label>
                                                    <input
                                                        onClick={() =>
                                                            handleClose(
                                                                "check-in"
                                                            )
                                                        }
                                                        placeholder="YYYY - MM - DD"
                                                        value={
                                                            openCalendar[0].date
                                                        }
                                                    />
                                                </div>

                                                {openCalendar.map(
                                                    (block) =>
                                                        block.key ===
                                                            "check-in" &&
                                                        block.open && (
                                                            <CalendarContainer
                                                                onClickDay={(
                                                                    value,
                                                                    event
                                                                ) => {
                                                                    handleSetDate(
                                                                        "check-in",
                                                                        value
                                                                    );
                                                                    handleClose(
                                                                        "check-in"
                                                                    );
                                                                }}
                                                                calendarType="US"
                                                                setOpenCalendar={
                                                                    setOpenCalendar
                                                                }
                                                                openCalendar={
                                                                    openCalendar
                                                                }
                                                                key={"check-in"}
                                                                className={
                                                                    styles.tourPackageAreaCalendar
                                                                }
                                                                // destinations="uk"
                                                            />
                                                        )
                                                )}
                                            </div>
                                        </Form.Field>
                                        <Form.Field
                                            className={
                                                styles.tourPackageFormField
                                            }
                                        >
                                            <div>
                                                <div>
                                                    <label>Check Out</label>
                                                    <input
                                                        onClick={() =>
                                                            handleClose(
                                                                "check-out"
                                                            )
                                                        }
                                                        placeholder="YYYY - MM - DD"
                                                        value={
                                                            openCalendar[1].date
                                                        }
                                                    />
                                                </div>

                                                {openCalendar.map(
                                                    (block) =>
                                                        block.key ===
                                                            "check-out" &&
                                                        block.open && (
                                                            <CalendarContainer
                                                                onClickDay={(
                                                                    value,
                                                                    event
                                                                ) => {
                                                                    handleSetDate(
                                                                        "check-out",
                                                                        value
                                                                    );
                                                                    handleClose(
                                                                        "check-out"
                                                                    );
                                                                }}
                                                                calendarType="US"
                                                                setOpenCalendar={
                                                                    setOpenCalendar
                                                                }
                                                                openCalendar={
                                                                    openCalendar
                                                                }
                                                                key={
                                                                    "check-out"
                                                                }
                                                                className={
                                                                    styles.tourPackageAreaCalendar
                                                                }
                                                                // destinations="uk"
                                                            />
                                                        )
                                                )}
                                            </div>
                                        </Form.Field>
                                        <Form.Field
                                            className={
                                                styles.tourPackageFormField
                                            }
                                        >
                                            <label>Number Of Adults</label>

                                            <Input
                                                type="number"
                                                style={{ minWidth: "250px" }}
                                                value={search.adults}
                                                onChange={(e) =>
                                                    setSearch({
                                                        ...search,
                                                        adults: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Field>
                                        <Form.Field
                                            className={
                                                styles.tourPackageFormField
                                            }
                                        >
                                            <Button
                                                className={
                                                    styles.tourPackageButtonSearch
                                                }
                                                onClick={() => handleSearch()}
                                            >
                                                <Icon name="search" />
                                                Find now
                                            </Button>
                                        </Form.Field>
                                        {/* </Form> */}
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Segment
                                        raised
                                        className={
                                            styles.tourPackageSegmentLeft
                                        }
                                    >
                                        <h4>Accommodation types</h4>

                                        {accommodationTypes.map(
                                            (option, option_index) => (
                                                <Checkbox
                                                    label={option.value}
                                                    className={
                                                        styles.tourPackageCheckbox
                                                    }
                                                    type="checkbox"
                                                    checked={_.get(
                                                        selectedTypes,
                                                        [
                                                            _.snakeCase(
                                                                option.value
                                                            ),
                                                            "checked",
                                                        ],
                                                        false
                                                    )}
                                                    key={`${option_index}`}
                                                    name={`${option_index}`}
                                                    value={option}
                                                    onChange={(e, data) =>
                                                        myHandleChangeCheck(
                                                            data,
                                                            option.value
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Segment
                                        raised
                                        className={
                                            styles.tourPackageSegmentLeft
                                        }
                                    >
                                        <h4>Price Range</h4>
                                        <PriceRange
                                            min={100}
                                            max={150}
                                            minVal={minVal}
                                            maxVal={maxVal}
                                            setMinVal={setMinVal}
                                            setMaxVal={setMaxVal}
                                        />
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Segment
                                        raised
                                        className={
                                            styles.tourPackageSegmentLeft
                                        }
                                    >
                                        <h4>Rating</h4>
                                        {rating.map((item) => (
                                            <Checkbox
                                                label={
                                                    <label>
                                                        <Rating
                                                            className={
                                                                styles.tourPackageIcon
                                                            }
                                                            icon="star"
                                                            maxRating={5}
                                                            defaultRating={
                                                                item.rate
                                                            }
                                                            disabled
                                                        />
                                                    </label>
                                                }
                                                className={
                                                    styles.tourPackageCheckbox
                                                }
                                                type="checkbox"
                                                value={item.rate}
                                                checked={
                                                    item.rate ===
                                                    search.starRating
                                                }
                                                onChange={
                                                    (e, data) =>
                                                        setSearch({
                                                            ...search,
                                                            starRating:
                                                                data.value,
                                                        })
                                                    // console.log(item)
                                                }
                                            />
                                        ))}
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Banner />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column
                        floated="right"
                        style={{
                            width: "850px",
                            paddingLeft: "90px",
                            paddingRight: "auto",
                        }}
                    >
                        <Grid className={styles.tourPackageSegmentRight}>
                            <Grid.Row>
                                <Grid.Column width={12}>
                                    <h5 className={styles.topToursH5}>
                                        Showing 1-10 of 50 Results
                                    </h5>
                                </Grid.Column>
                                <Grid.Column floated="right" width={4}>
                                    <Dropdown
                                        className={styles.tourPackageSelect}
                                        options={sortOptions}
                                        defaultValue={sortOptions[0].value}
                                        fluid
                                        selection
                                        scrolling
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                {currentItems?.length ? (
                                    // store.api.tours?.map((item) => (
                                    currentItems?.map((item) => (
                                        <Grid.Column
                                            style={{ marginRight: "0px" }}
                                        >
                                            <TourCard
                                                item={item}
                                                locale={search.destination}
                                                destination={destinationName}
                                                // onChange={handleChange}
                                                offer={false}
                                            />
                                        </Grid.Column>
                                    ))
                                ) : (
                                    <div
                                        className={styles.tourPackageDivLoader}
                                    >
                                        <Dimmer active inverted>
                                            <Loader
                                                inverted
                                                content="Loading"
                                                className={
                                                    styles.tourPackageLoader
                                                }
                                            />
                                        </Dimmer>
                                    </div>
                                )}
                            </Grid.Row>
                        </Grid>
                        <div className={styles.topToursPagination}>
                            <CustomPagination
                                handlePageClick={handlePageClick}
                                pageCount={pageCount}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Footer />
        </>
    );
};

export default TourPackage;
