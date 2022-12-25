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
import { useSelector } from 'react-redux';

export default function Home() {
    
    return(
    <Box>
    <Navbar currentPage = "home" />
    {useSelector(state => state.username)}
    </Box>
    );
}