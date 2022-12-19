import React from 'react';
import Navbar from './Navbar.js';

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
    Heading,
  } from '@chakra-ui/react';

export default function Profile() {
    return(
    <Box>
    <Navbar currentPage = "profile" />
    <Box align = "center">
    <Heading>Profile</Heading>
    </Box>
    </Box>
    );
}