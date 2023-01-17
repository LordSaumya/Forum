//Imports
import React from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Stack,
    Box,
    Flex,
    Heading,
    Divider,
    FormErrorMessage,
} from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import LogoImage from './logo.png';
import UseFetch from './UseFetch';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from './Toast.js';

const bcrypt = require('bcryptjs');

// Body

// Main container for registration page
export default function Registration() {
    const location = useLocation();
    let notif = location.state ? location.state.typeNotification : null;

    //Provides toast functionality with location parameters
    Toast(notif);

    return (
        <Box align="center">
            <Flex width="100%" justify="center" margin="20px" align="center"><img style={{ verticalAlign: "centre" }} src={LogoImage} alt="Logo" width="90px" /><Heading size="2xl" margin="20px">HighGear</Heading>
                <ColorModeSwitcher marginLeft="auto" marginRight="50px" /></Flex>
            <Divider width="95%" />
            <br /><br />
            <Heading size="lg" id="Heading">Sign Up</Heading>
            <Box id="signupContainer">
                <SignUp />
            </Box>
            <Box id="loginContainer" style={{ display: "none" }}>
                <Login />
            </Box>
            <br />
            <p id="loginText">
                Have an account? <Button variant="link" color="green.800" onClick={() => changeTo("Login")}>Log in</Button>
            </p>
            <p id="signupText" style={{ display: "none" }}>
                Don't have an account? <Button variant="link" color="green.800" onClick={() => changeTo("Signup")}>Sign Up</Button>
            </p>
            <br /><br />
        </Box>
    );
}

//Sign up form
function SignUp() {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [usernameInput, setUsernameInput] = React.useState("");
    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");
    const [confirmPasswordInput, setConfirmPasswordInput] = React.useState("");

    const userData = UseFetch("https://highgear.herokuapp.com/users");
    const usedUsernames = userData ? userData.map((user) => user.username) : [];
    console.log(usedUsernames);
    const usedEmails = userData ? userData.map((user) => user.email) : [];

    //Stores user in the Redux store and navigates to the home page
    function signupRedux(data) {
        const action = { type: "LOGIN", username: data.username, id: data.id };
        console.log(data.username);
        dispatch(action);
        try {
            Navigate("/", { state: { typeNotification: "accountCreated" } });
        }
        catch (e) {
            console.log(e);
        }
    }

    const handleUsernameChange = (event) => {
        setUsernameInput(event.target.value);
    }
    const isUsernameError = !userData || usernameInput === "" || usedUsernames.includes(usernameInput);

    const handleEmailChange = (event) => {
        setEmailInput(event.target.value);
    }
    const isEmailError = usedEmails.includes(emailInput) || emailInput === "" || !emailInput.includes("@") || !emailInput.includes(".") || emailInput.indexOf("@") > emailInput.indexOf(".") || emailInput.indexOf("@") === 0 || emailInput.indexOf(".") === 0 || emailInput.indexOf("@") === emailInput.length - 1 || emailInput.indexOf(".") === emailInput.length - 1 || emailInput.indexOf("@") === emailInput.indexOf(".") - 1 || !emailInput.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    const handlePasswordChange = (event) => {
        setPasswordInput(event.target.value);
    }
    const isPasswordError = passwordInput === "" || passwordInput.length < 8 || !passwordInput.match(/[a-z]/) || !passwordInput.match(/[A-Z]/) || !passwordInput.match(/[0-9]/);

    const handleConfirmPasswordChange = (event) => {
        setConfirmPasswordInput(event.target.value);
    }
    const isConfirmPasswordError = !isPasswordError && (confirmPasswordInput !== passwordInput);

    //Sends request to create the new user account.
    const handleSubmit = (event) => {
        console.log("Submitted");
        event.preventDefault();
        if (!isPasswordError && !isConfirmPasswordError && !isEmailError && !isUsernameError) {
            //Hashes the password before sending it to the server
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(passwordInput, salt);

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, email: emailInput, password: hash })
            };
            fetch('https://highgear.herokuapp.com/users', requestOptions)
                .then(response => response.json())
                .then(data => signupRedux(data))
                .catch((e) => { console.log(JSON.stringify(e)) });
        }
        else {
            alert("One or more inputs are invalid. Please check your credentials and try again.");
        }
    }
    return (
        <Stack spacing={3} padding="20px" width="50%" boxShadow="xl">
            <form onSubmit={handleSubmit}>
                <FormControl id="username" isInvalid={isUsernameError} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input placeholder="Username" onChange={handleUsernameChange} />
                    {!isUsernameError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;This username is available.</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Username is blank or already taken.</FormErrorMessage>)}
                </FormControl>
                <FormControl id="email" isInvalid={isEmailError} isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" placeholder="Email address" onChange={handleEmailChange} />
                    {!isEmailError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;We will never share your email</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;This email is invalid or already in use.</FormErrorMessage>)}
                </FormControl>
                <FormControl id="password" isInvalid={isPasswordError} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="Password" onChange={handlePasswordChange} />
                    {!isPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;This password matches the requirements</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Password must include at least 8 characters, an uppercase letter, a lowercase letter, and a number</FormErrorMessage>)}
                </FormControl>
                <FormControl id="confirmPassword" isInvalid={isConfirmPasswordError} isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" placeholder="Confirm password" onChange={handleConfirmPasswordChange} />
                    {!isConfirmPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;Your passwords match</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;The passwords must match</FormErrorMessage>)}
                </FormControl>
                <br />
                <Button colorScheme={isEmailError || isUsernameError || isPasswordError || isConfirmPasswordError ? "gray" : "teal"} type="submit" disabled={isEmailError || isUsernameError || isPasswordError || isConfirmPasswordError}>
                    Sign Up
                </Button>
            </form>
        </Stack>
    );
}

//Login form
function Login() {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const [usernameInput, setUsernameInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");

    let userData = UseFetch("https://highgear.herokuapp.com/users/s/" + usernameInput);

    const handleUsernameChange = (event) => {
        setUsernameInput(event.target.value);
    }
    const isUsernameError = !userData || usernameInput.length === 0 || userData.length === 0;

    const handlePasswordChange = (event) => {
        setPasswordInput(event.target.value);
    }

    //Compares hash of entered password to the hash stored in the database.
    const isPasswordError = isUsernameError || passwordInput.length === 0 || (userData[0] && !bcrypt.compareSync(passwordInput, userData[0].password));

    const handleSubmit = (event) => {
        console.log("Submitted");
        event.preventDefault();
        if (!isUsernameError && !isPasswordError) {
            console.log(userData[0].id)
            const action = { type: "LOGIN", username: usernameInput, id: userData[0].id };
            console.log(usernameInput);
            dispatch(action);
            try {
                Navigate("/", { state: { typeNotification: "loggedIn" } });
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert("One or more inputs are invalid. Please check your credentials and try again.");
        }
    }
    return (
        <Stack spacing={3} padding="20px" width="50%" boxShadow="xl">
            <form onSubmit={handleSubmit}>
                <FormControl id="username" label="Please enter your username" isInvalid={isUsernameError} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input placeholder="Username" onChange={handleUsernameChange} />
                    {!isUsernameError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;This username is in our system</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Username does not exist</FormErrorMessage>)}
                </FormControl>
                <FormControl id="password" label="Please enter your password" isInvalid={isPasswordError} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="Password" onChange={handlePasswordChange} />
                    {!isPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;The password is correct</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;The password is incorrect</FormErrorMessage>)}
                </FormControl><br />
                <Button colorScheme={isUsernameError || isPasswordError ? "grey" : "teal"} type="submit" disabled={isUsernameError || isPasswordError}>
                    Login
                </Button>
            </form>
        </Stack>
    );
}

//Toggles visibility between login and signup
function changeTo(newPage) {
    if (newPage === "Signup") {
        document.getElementById("Heading").innerHTML = "Sign Up";
        document.getElementById("loginText").style.display = "block";
        document.getElementById("signupText").style.display = "none";
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("signupContainer").style.display = "block";
    }
    else {
        document.getElementById("Heading").innerHTML = "Login";
        document.getElementById("loginText").style.display = "none";
        document.getElementById("signupText").style.display = "block";
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("signupContainer").style.display = "none";
    }
}