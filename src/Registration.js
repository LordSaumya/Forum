import React from 'react';
import Navbar from './Navbar.js';
import {
    Button, 
    FormControl, 
    FormLabel, 
    FormHelperText, 
    Input, 
    Stack, 
    useDisclosure,
    useColorModeValue,
    useMediaQuery,
    ChakraProvider,
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    theme,
    ButtonGroup,
    Container,
    Flex,
    Switch,
    HStack,
    Heading,
    Divider,    
  } from '@chakra-ui/react';
  import LogoImage from './logo.png';
  import { ColorModeSwitcher } from './ColorModeSwitcher';
export default function Registration() {
    return(
    <Box align = "center">
        <Flex width = "100%" justify = "center" margin = "20px" align = "center"><img style = {{verticalAlign: "centre"}} src = {LogoImage} alt = "Logo" width = "90px"/><Heading size = "2xl" margin = "20px">HighGear</Heading>
        <ColorModeSwitcher marginLeft = "auto" marginRight = "50px"/></Flex>
        <Divider width = "95%" />
        <br /><br />
        <Heading size = "lg" id = "Heading">Sign Up</Heading>
        <Box id = "signupContainer">
        <SignUp />
        </Box>
        <Box id = "loginContainer" style = {{display:"none"}}>
        <Login />
        </Box>
        <br />
        <p id = "loginText">
        Have an account? <Button variant = "link" color = "green.800" onClick = {() => changeTo("Login")}>Log in</Button>
        </p>
        <p id = "signupText" style = {{display: "none"}}>
        Don't have an account? <Button variant = "link" color = "green.800" onClick = {() => changeTo("Signup")}>Sign Up</Button>
        </p>
        <br /><br />
    </Box>
    );
}

function SignUp(){
    return(
        <Stack spacing={3} padding = "20px" width = "50%" boxShadow = "xl">
            <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input placeholder="Username" />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" placeholder = "Email address"/>
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder = "Password" />
            </FormControl><br />
            <Button colorScheme="blue" type="submit">
                Sign Up
            </Button>
        </Stack>
    );
}

function Login(){
    return(
        <Stack spacing={3} padding = "20px" width = "50%" boxShadow = "xl">
            <FormControl id="email" label = "Please enter your email address" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" placeholder = "Email address" />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder = "Password"/>
            </FormControl><br />
            <Button colorScheme="blue" type="submit">
                Login
            </Button>
        </Stack>
    );
}

function changeTo(newPage){
    if(newPage === "Signup"){
        document.getElementById("Heading").innerHTML = "Sign Up";
        document.getElementById("loginText").style.display = "block";
        document.getElementById("signupText").style.display = "none";
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("signupContainer").style.display = "block";
    }
    else{
        document.getElementById("Heading").innerHTML = "Login";
        document.getElementById("loginText").style.display = "none";
        document.getElementById("signupText").style.display = "block";
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("signupContainer").style.display = "none";
    }
}