import React from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import {
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
    Button,
    ButtonGroup,
    Container,
    Flex,
    HStack,
  } from '@chakra-ui/react';
import { json } from 'react-router-dom';

export default function Home() {
    const data = UseFetch('http://localhost:4000/users/1');
    const username = data ? data.username : "Loading";
    return(
    <Box>
    <Navbar currentPage = "home" />
    {username}
    </Box>
    );
}