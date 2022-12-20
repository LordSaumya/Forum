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
  import { ColorModeSwitcher } from './ColorModeSwitcher';
  import { Navigate } from 'react-router-dom';
  import UseFetch from './UseFetch';
  import LogoImage from './logo.png';

function Navbar(props){
    const { data: usnm, loading, error } = UseFetch('/');
    // if (error) {                                 UNCOMMENT WHEN BACKEND IS READY
    //   console.log(error);
    //   return (<Navigate replace to="/Registration" />);
    // }
    return (
      <Box
        as="section"
        pb={{
          base: '12',
          md: '24',
        }}
      >
        <Box as="nav" bg="bg-surface">
          <Container
            py={{
              base: '4',
              lg: '5',
            }}
            minW = "100%"
            borderBottomWidth = ".5px"
            boxShadow='md'
          >
            <HStack spacing="10" justify="space-between">
              <img src = {LogoImage} alt = "Logo" width = "50px"/>
              <Flex justify="space-between" flex="1">
                  <ButtonGroup variant="ghost" spacing="8">
                  <a href = "./"><Button variant = {props.currentPage === "home" ? "solid" : "ghost"}>Home</Button></a>
                  <a href = "./ProfilePage"><Button variant = {props.currentPage === "profile" ? "solid" : "ghost"}>Profile</Button></a>
                  </ButtonGroup>
                  <HStack spacing="3">
                  <ColorModeSwitcher justifySelf="flex-end" />
                    <Button variant="ghost"><NavProf UserName = {loading ? 'Loading...' :  error ? 'we are currently facing errors. Sorry' : usnm}/></Button>
                  </HStack>
                </Flex>
            </HStack>
          </Container>
        </Box>
      </Box>
    );
  }
  
  function NavProf(props){
    return (
        <a href = "./ProfilePage"><Text fontSize="sm" fontWeight="medium" color="gray.500">Hello, {props.UserName}!</Text></a>
    );
  }

  export default Navbar;