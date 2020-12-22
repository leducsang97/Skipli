import React, { useState } from "react";
import {
	CssBaseline,
	Button,
	FormControl,
	Input,
	InputLabel,
	Paper,
	makeStyles,
} from "@material-ui/core";

const FormComponent = () => {
	const classes = useStyles();
	const [code, setCode] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [notification, setNoti] = useState("");

	const codeHandler = (event) => {
		setNoti("");
		setCode(event.target.value);
	};

	const phoneNumberHandler = (event) => {
		setNoti("");
		setPhoneNumber(event.target.value);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		//validate phone
		let phone = phoneNumber.replace(/\D/g, "");
		//validate code
		if (phone.length === 10 && code.length === 6) {
			fetch(`http://localhost:5000/authorize?phone=${phone}&code=${code}`)
				.then((res) => res.json())
				.then((isValid) => {
					if (isValid) {
						setNoti("Verify success");
						alert("Verify success");
					} else setNoti("The code is incorrect");
				});
		} else {
			setNoti("Phone or code is not valid");
		}
	};

	const onCodeSubmit = (event) => {
		event.preventDefault();
		//validate phone
		let phone = phoneNumber.replace(/\D/g, "");
		if (phone.length === 10) {
			fetch(`http://localhost:5000/sendMessage?phone=${phone}`)
				.then((res) => res.json())
				.then((data) => {
					setNoti("SMS sent, check your phone.");
				});
		} else {
			setNoti("Phone number is not valid.");
		}
	};

	return (
		<main className={classes.main}>
			<CssBaseline />
			<Paper className={classes.paper}>
				<div className={classes.formContainer}></div>
				<form className={classes.form}>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="phone">Phone Number </InputLabel>
						<Input
							id="phone"
							name="phone"
							autoComplete="phone"
							type="email"
							pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
							onChange={phoneNumberHandler}
							autoCapitalize="off"
							placeholder={"999-999-9999"}
							value={phoneNumber}
							autoFocus
						/>
					</FormControl>
					<Button
						type="button"
						variant="contained"
						color="secondary"
						className={classes.submit}
						onClick={onCodeSubmit}
					>
						Get Code
					</Button>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="password">
							Enter the code send to your phone:{" "}
						</InputLabel>
						<Input
							type="code"
							name="code"
							id="code"
							onChange={codeHandler}
							autoComplete="code"
							placeholder={"123456"}
						/>
					</FormControl>

					<Button
						type="button"
						variant="contained"
						color="secondary"
						className={classes.submit}
						onClick={onSubmit}
					>
						Submit
					</Button>
				</form>
				<p>{notification}</p>
			</Paper>
		</main>
	);
};

const useStyles = makeStyles((theme) => ({
	main: {
		width: "auto",
		display: "block", // Fix IE 11 issue.
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
			width: 400,
			marginLeft: "auto",
			marginRight: "auto",
		},
	},
	paper: {
		marginTop: 30,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: theme.spacing(3),
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
}));

export default FormComponent;
