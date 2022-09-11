import { Button, Dropdown, Icon, Menu } from "semantic-ui-react";
import { currency, lang } from "../../Backend/Data";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopHeader = () => {
	let navigate = useNavigate();
	const [headerShow, setHeaderShow] = useState(false);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
	}, [headerShow]);

	const handleScroll = () => {
		window.scrollY > 0 ? setHeaderShow(true) : setHeaderShow(false);
	};

	const handleClick = () => {
		navigate("/login");
	};

	return (
		<Menu
			secondary
			pointing
			className={styles.headerMenuTop}
			style={{ background: headerShow ? "#fff" : "transparent" }}
		>
			<Menu.Item className={styles.headerItemsTop} name={"item"}>
				<Icon name="phone" className={styles.iconHeaderTop} /> +2 123 4567 897
			</Menu.Item>
			<Menu.Item className={styles.headerItemsTop} name={"item"}>
				<Icon name="envelope" className={styles.iconHeaderTop} />{" "}
				info@example.com
			</Menu.Item>

			<Menu.Item className={styles.headerItemsTop}>
				<base target="_blank"></base>
				<a href="https://uk-ua.facebook.com/">
					<Icon name="facebook" className={styles.iconHeaderTopLinks} />
				</a>
			</Menu.Item>

			<Menu.Item className={styles.headerItemsTop}>
				<base target="_blank"></base>
				<a href="https://twitter.com/">
					<Icon name="twitter" className={styles.iconHeaderTopLinks} />
				</a>
			</Menu.Item>
			<Menu.Item className={styles.headerItemsTop}>
				<base target="_blank"></base>
				<a href="https://www.instagram.com/">
					<Icon name="instagram" className={styles.iconHeaderTopLinks} />
				</a>
			</Menu.Item>
			<Menu.Item className={styles.headerItemsTop}>
				<base target="_blank"></base>
				<a href="https://www.linkedin.com/">
					<Icon name="linkedin" className={styles.iconHeaderTopLinks} />
				</a>
			</Menu.Item>

			<Menu.Menu position="right">
				<Menu.Item className={styles.headerItemsTop}>
					<Dropdown
						compact
						text={lang[0].key}
						simple
						item
						className={styles.headerDropdown}
					>
						<Dropdown.Menu className={styles.headerDropdownMenu}>
							{lang.map((item) => (
								<div>
									<Dropdown.Item className={styles.headerDropdownItem}>
										{item.key}
									</Dropdown.Item>
								</div>
							))}
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>

				<Menu.Item className={styles.headerItemsTop}>
					<Dropdown
						compact
						text={currency[0].key}
						simple
						item
						className={styles.headerDropdown}
					>
						<Dropdown.Menu className={styles.headerDropdownMenu}>
							{currency.map((item) => (
								<div>
									<Dropdown.Item className={styles.headerDropdownItem}>
										{item.key}
									</Dropdown.Item>
								</div>
							))}
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>

				<Menu.Item className={styles.headerItemsTop}>
					<Button className={styles.headerTopButton} onClick={handleClick}>
						<Icon name="sign in" />
						Login
					</Button>
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};

export default TopHeader;
