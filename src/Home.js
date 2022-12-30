import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import Editor from './Editor.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import {FaArrowCircleUp} from 'react-icons/fa';
import {
    useColorModeValue,
    useMediaQuery,
    ChakraProvider,
    Box,
    Text,
    Link,
    Badge,
    VStack,
    Code,
    Grid,
    IconButton,
    theme,
    Button,
    ButtonGroup,
    Container,
    Flex,
    HStack,
    LightMode,
    Heading,
    Divider,
    FormControl,
    FormLabel,
    Spinner,
    FormErrorMessage,
    FormHelperText,
    Collapse,
    Input,
  } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {CheckIcon, WarningIcon, AddIcon, ChatIcon, Search2Icon} from '@chakra-ui/icons';

function ThreadForm() {
    const [desc, setDesc] = useState("");
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");

    const threadsData = UseFetch("http://localhost:4000/forum_threads");
    let usedTags = threadsData ? threadsData.map((thread) => thread.tag) : [];
    usedTags = Array.from(new Set(usedTags));

    const isTitleError = !(title.length > 10);
    const isDescError = !(desc.replace(/(<([^>]+)>)/gi, "").length > 50);
    const isTagError = tag === "";

    const user_id = useSelector(state => state.id);
    const handleCreateThread = (event) => {
        event.preventDefault();
        console.log("Creating thread");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({User_id: user_id, title: title, description: desc, tag: tag})
        };
        fetch('http://localhost:4000/forum_threads', requestOptions)
            .then(response => response.json())
            .then(data => refreshPage(data))
            .catch(err => console.log(err));
    }

    const refreshPage = (data) => {
        console.log(data);
        window.location.reload();
    }

    return(
        <Container minWidth="80%" padding = "0">
        <form onSubmit = {handleCreateThread}>
        <FormControl id = "title" label = "Please enter a title for your thread" isInvalid = {isTitleError} isRequired>
                <FormLabel>Title</FormLabel>
                <Input placeholder = "Title of your thread" onChange = {(e) => setTitle(e.target.value)}/>
                {!(isTitleError) ? (<FormHelperText color = "green.500"><CheckIcon color="green.500" />&nbsp; Great title!</FormHelperText>):(<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer title</FormErrorMessage>)}
        </FormControl>
        <br />
        <FormControl id = "description" label = "Please enter a description of the thread" isInvalid = {isDescError} isRequired>
                <FormLabel>Description</FormLabel>
                <Editor value = {desc} onChange = {setDesc}/>
                {!(isDescError) ? (<FormHelperText color = "green.500"><CheckIcon color="green.500" />&nbsp; Nice!</FormHelperText>):(<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer description</FormErrorMessage>)}
        </FormControl>
        <br />
        <FormControl id = "tag" label = "Please enter a tag for your thread" isInvalid = {isTagError} isRequired>
                <FormLabel>Tag</FormLabel>
                <Input placeholder = "Tag of your thread" value = {tag} onChange = {(e) => setTag(e.target.value)}/>
                {!(isTagError) ? (<FormHelperText color = "green.500"><CheckIcon color="green.500" />&nbsp; Great tag!</FormHelperText>):(<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a tag</FormErrorMessage>)}
                <br />Existing Tags:<br />
                <div style = {{overflowX:"scroll", whiteSpace: "nowrap", maxWidth: "80%", justifyContent: "center", display:"inline-block"}}>
                {usedTags.map((tag) => <Button margin = "5px" colorScheme = "green" key = {tag} onClick = {() => setTag(tag)}>{tag}</Button>)}
                </div>
        </FormControl>
        <br />
        <Button type = "submit" colorScheme="blue">Post Thread</Button>
        </form>
        </Container>
    );
}

function ThreadContainer(props){
    const [show, setShow] = React.useState(false)
    const timeAgo = moment(props.date).fromNow();
    const username = UseFetch("http://localhost:4000/users/" + props.user_id);
    const handleToggle = () => setShow(!show)

    return(
        <LazyLoad height={200}>
        <Container boxShadow="md" minWidth = "80%" padding = "10px" name = "threadContainer">
            <Badge ml='1' colorScheme='green' float = "right" name = "threadTag">
                {props.tag}
            </Badge>
            <Heading size = "md" name = "threadTitle">{props.title}</Heading>
            <Text fontSize = "sm" color = "gray.500">Posted by {username ? username.username : "Loading..."} {timeAgo}</Text>
            <Divider padding = "10px" /><br />
            <Collapse startingHeight = "80px" in = {show} padding = "10px" dangerouslySetInnerHTML={{ __html: props.desc }} name = "threadDesc">
            </Collapse>
            <Button size='sm' onClick={handleToggle} mt='1rem'>
                Show {show ? 'less' : 'all'}
            </Button>
            <br /><br />
        </Container>
        </LazyLoad>
    );
}


export default function Home() {
    const [showForm, setShowForm] = React.useState(false)
    const [showThreads, setShowThreads] = React.useState(true)
    let btnText = showThreads
    ? (<Text style = {{display:"inline"}}><AddIcon style = {{display:"inline"}} /><Text style = {{display:"inline"}}>&nbsp;&nbsp;Create thread</Text></Text>) 
    : (<Text style = {{display:"inline"}}><ChatIcon style = {{display:"inline"}} /><Text style = {{display:"inline"}}>&nbsp;&nbsp;Show threads</Text></Text>)

    const handleToggle = () => {
        setShowForm(!showForm)
        setShowThreads(!showThreads)
    }
    const threadsData = UseFetch("http://localhost:4000/forum_threads");

    function Search(item){
        var thread = document.getElementsByName("threadContainer");
        var numResults = 0;
        var threadTitle = document.getElementsByName("threadTitle");
        var threadDesc = document.getElementsByName("threadDesc");
        var threadTag = document.getElementsByName("threadTag");
        var noResults = document.getElementById("noResults");
        item = item.toLowerCase();
        
        for (let i = 0; i < thread.length; i++){
           if (((((threadDesc[i].innerHTML).replace(/(<([^>]+)>)/gi, "")).toLowerCase()).indexOf(item) > -1)||(((threadTag[i].innerHTML).toLowerCase()).indexOf(item) > -1)||(((threadTitle[i].innerHTML).toLowerCase()).indexOf(item) > -1)) {
            numResults += 1;
            thread[i].style.display = "block";
           } else {
            thread[i].style.display = "none";
           }
           }
          if(numResults === 0){
            noResults.style.display = "block";
          } else{
            noResults.style.display = "none";
          }
        }

    return( 
    <Box>
    <Navbar currentPage = "home" />
    <Box align = "center">
    <Button id = "toggleButton" colorScheme='cyan' onClick = {handleToggle} top = "0px" margin = "10px">
    {btnText}
    </Button>
    </Box><br />
    <Collapse in = {showForm} animateOpacity>
    <Box align = "center" id = "ThreadForm">
    <ThreadForm />
    </Box>
    </Collapse>
    <Collapse in = {showThreads} animateOpacity>
    <Box align = "center"><Search2Icon />&nbsp;&nbsp;<Input width = "50%" id = "search" placeholder = "Search for a thread" onChange = {(e) => Search(e.target.value)} /></Box>< br/>
    <Box align = "center" id = "noResults" style = {{display:"none"}}><Text>No results found</Text></Box>
        {threadsData ? threadsData.map((thread) => <ThreadContainer date = {thread.created_at} user_id = {thread.User_id} key = {thread.id} title = {thread.title} desc = {thread.description} tag = {thread.tag} />) : (<Box align = "center"><Spinner size = "xl" /></Box>)}
    <br /><Box align = "center"><Button onClick = {() => window.scrollTo({top: 0, behavior: "smooth"})}><FaArrowCircleUp />Scroll to Top</Button></Box>
    </Collapse>
    </Box>
    );
}