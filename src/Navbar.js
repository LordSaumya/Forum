import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useNavigate } from 'react-router-dom';
import LogoImage from './logo.png';
import moderatorList from './moderatorsList.json';
import { useSelector, useDispatch } from 'react-redux';

function Navbar(props) {
  const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
  const username = useSelector(state => state.username);
  const Navigate = useNavigate();
  const profPageLink = "/ProfilePage/" + username;
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
          minW="100%"
          borderBottomWidth=".5px"
          boxShadow='md'
        >
          <HStack spacing="10" justify="space-between">
            <img src={LogoImage} alt="Logo" width="50px" />
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="ghost" spacing="8">
                <a href="/"><Button variant={props.currentPage === "home" ? "solid" : "ghost"}>Home</Button></a>
                <a href={profPageLink}><Button variant={props.currentPage === "profile" ? "solid" : "ghost"}>Profile</Button></a>
                {mods.includes(username) ? <Button onClick={() => Navigate("/ModDashboard", { state: { access: true } })} variant={props.currentPage === "moderator" ? "solid" : "ghost"}>Moderator Dashboard</Button> : <></>}
              </ButtonGroup>
              <HStack spacing="3">
                <ColorModeSwitcher justifySelf="flex-end" />
                <NavProf />
              </HStack>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}

function NavProf() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const username = useSelector(state => state.username);

  const logOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      const action = { type: "LOGOUT" };
      dispatch(action);
      try {
        Navigate("/Registration", { state: { typeNotification: "loggedOut" } });
      }
      catch (e) {
        console.log(e);
      }
    }
  }

  if (!username) {
    Navigate("/Registration", { state: { typeNotification: "notLoggedIn" } })
    return (<></>);
  }
  else {
    return (<Button variant="ghost" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={logOut} width="150px" overflow="auto">
      <Text fontSize="sm" fontWeight="medium" color="gray.500">{isHovering ? "Log out?" : "Hello, " + username + "!"}</Text>
    </Button>);
  }
}

export default Navbar;