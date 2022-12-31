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
    Select,
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
import store from './store.js';
import { useSelector } from 'react-redux';
import {CheckIcon, WarningIcon, ChatIcon, RepeatIcon, Search2Icon, CloseIcon} from '@chakra-ui/icons';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

function CommentForm() {
    const [content, setContent] = useState("");
    const isContentError = !(content.replace(/(<([^>]+)>)/gi, "").length > 50);

    const user_id = useSelector(state => state.id);
    const threadID = useParams().id;

    const handleCreateComment = (event) => {
        event.preventDefault();
        console.log(content);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({User_id: user_id, ForumThread_id: threadID, content: content})
        };
        fetch('http://localhost:4000/forum_threads/' + threadID + "/comments", requestOptions)
            .then(response => response.json())
            .then(data => refreshPage(data))
            .catch(err => console.log(err));
    }

    const refreshPage = (data) => {
        console.log("Refreshing page")
        console.log(data);
        window.location.reload();
    }

    return(
        <Container minWidth="80%" padding = "0">
        <form onSubmit = {handleCreateComment}>
        <br />
        <FormControl id = "description" label = "Please enter your comment" isInvalid = {isContentError} isRequired>
                <FormLabel>Comment</FormLabel>
                <Editor value = {content} onChange = {setContent}/>
                {!(isContentError) ? (<FormHelperText color = "green.500"><CheckIcon color="green.500" />&nbsp; Nice!</FormHelperText>):(<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer comment</FormErrorMessage>)}
        </FormControl>
        <br />
        <Button type = "submit" colorScheme="blue">Post Comment</Button>
        </form>
        </Container>
    );
}

function ThreadContainer(props){
    const Navigate = useNavigate();
    const [show, setShow] = React.useState(false)
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("http://localhost:4000/users/" + props.User_id);
    const handleToggle = () => setShow(!show)

    const redirectDelete = (data) => {
        console.log(data);
        Navigate("/");
    }

    const handleDelete = (event) => {
        console.log(props.id)
        if (window.confirm("Are you sure you want to delete this thread?")) {
            event.preventDefault();
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
        };
        fetch('http://localhost:4000/forum_threads/' + props.id, requestOptions)
            .then(response => response.json())
            .then(data => redirectDelete(data))
            .catch(err => console.log(err));
    }
}

    return(
        <Container boxShadow="md" minWidth = "90%" padding = "10px" name = "threadContainer" marginBottom = "10px">
            <Badge ml='1' colorScheme='green' float = "right" name = "threadTag">
                {props.tag}
            </Badge>
            <Heading size = "md" name = "threadTitle">{props.title}</Heading>
            <Text fontSize = "sm" color = "gray.500">Posted by {author ? author.username : ""} {timeAgo}</Text>
            <Divider padding = "10px" /><br />
            <Collapse startingHeight = "80px" in = {show} padding = "10px" dangerouslySetInnerHTML={{ __html: props.desc }} name = "threadDesc">
            </Collapse>
            <Button size='sm' onClick={handleToggle} mt='1rem'>
                Show {show ? 'less' : 'all'}
            </Button>
            {console.log(props.User_id + " , " + useSelector(state => state.id))}
            {props.User_id === useSelector(state => state.id) ? (
            <>
            <Divider padding = "10px" />
            <Box display = "flex" justifyContent = "center" gap = "3%" margin = "10px">
            <Button colorScheme="red" onClick = {handleDelete}>Delete Thread</Button>
            <Button colorScheme="blue" onClick = {() => Navigate("/edit_thread/" + props.id)}>Edit Thread</Button>
            </Box>
            </>
            ) : (<></>)}
        </Container>
    );
}

function CommentContainer(props){
    const timeAgo = moment(props.date).fromNow();
    const username = UseFetch("http://localhost:4000/users/" + props.user_id);
    return(
        <LazyLoad height={200}>
        <Container boxShadow="md" minWidth = "80%" padding = "10px" name = "commentContainer" marginBottom = "10px">
            <Text fontSize = "sm" color = "gray.500">Posted by {username ? username.username : "Loading..."} {timeAgo}</Text>
            <Divider padding = "10px" />
            <Box padding = "10px" dangerouslySetInnerHTML={{ __html: props.content }} name = "commentContent">
            </Box>
        </Container>
        </LazyLoad>
    );
}


export default function Thread() {
    const threadID = useParams().id;
    const [showForm, setShowForm] = React.useState(false)
    const thread = UseFetch("http://localhost:4000/forum_threads/" + threadID);

    let btnText = showForm
    ? (<Text style = {{display:"inline"}}><CloseIcon style = {{display:"inline"}} /><Text style = {{display:"inline"}}>&nbsp;&nbsp;Close editor</Text></Text>) 
    : (<Text style = {{display:"inline"}}><ChatIcon style = {{display:"inline"}} /><Text style = {{display:"inline"}}>&nbsp;&nbsp;Add a comment</Text></Text>)

    const handleToggle = () => {
        setShowForm(!showForm)
    }

    const commentsData = UseFetch("http://localhost:4000/forum_threads/" + threadID + "/comments");
    const [sort_by, setSort_by] = React.useState("date");
    const [reverse, setReverse] = React.useState(false);

    const sortedComments = commentsData ? commentsData.sort((a, b) => {
        if (sort_by === "date") {
            return reverse ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
        } else if (sort_by === "content") {
            return reverse ? b.content.localeCompare(a.content) : a.content.localeCompare(b.content);        
        } else{
            return commentsData;
        }
    }) : null;

    function Search(item){
        var comment = document.getElementsByName("commentContainer");
        var numResults = 0;
        var commentContent = document.getElementsByName("commentContent");
        var noResults = document.getElementById("noResults");
        item = item.toLowerCase();
        
        for (let i = 0; i < comment.length; i++){
           if (((((commentContent[i].innerHTML).replace(/(<([^>]+)>)/gi, "")).toLowerCase()).indexOf(item) > -1)) {
            numResults += 1;
            comment[i].style.display = "block";
           } else {
            comment[i].style.display = "none";
           }
           }
          if(numResults === 0){
            noResults.style.display = "block";
          } else{
            noResults.style.display = "none";
          }
        }

        const [visible, setVisible] = useState(false)
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop;
            if (scrolled > 300){
                setVisible(true)
            }
            else if (scrolled <= 300){
                setVisible(false)
            }
        }
        window.addEventListener('scroll', toggleVisible);
    return(
    <Box>
    <Navbar currentPage = "home" />
    <Box id = "threadContainer">
    {thread ? <ThreadContainer date = {thread.created_at} title = {thread.title} desc = {thread.description} tag = {thread.tag} User_id = {thread.User_id} id = {thread.id} /> : <Text>Loading...</Text>}
    </Box><br />
    <Box align = "center" style = {{display:"flex", justifyContent: "center", gap: "10px", verticalAlign:"middle"}}><Search2Icon />&nbsp;&nbsp;<Input width = "50%" id = "search" placeholder = "Search for a comment" onChange = {(e) => Search(e.target.value)} />
    <Select id = "sort" onChange = {(e) => setSort_by(e.target.value)} width = "9%">
        <option value = "date">Date</option>
        <option value = "content">Content</option>
    </Select>
    <Button onClick = {() => setReverse(!reverse)}><RepeatIcon /></Button>
    </Box>< br/>
    <Box align = "center">
    <Button id = "toggleButton" colorScheme='cyan' onClick = {handleToggle} top = "0px" margin = "10px">
    {btnText}
    </Button>
    </Box>
    <Collapse in = {showForm} animateOpacity>
    <Box align = "center" id = "CommentForm">
    <CommentForm />
    </Box>
    </Collapse>
    <Box align = "center" id = "noResults" style = {{display:"none"}}><Text>No results found</Text></Box>
        {sortedComments ? sortedComments.map((com) => <CommentContainer id = {com.id} date = {com.created_at} user_id = {com.User_id} key = {com.id} content = {com.content} />) : (<Box align = "center"><Spinner size = "xl" /></Box>)}
    <br /><Box align = "center" float = "left" style = {{display:"inline"}}><Button id = "scrollToTopBtn" bottom = "10px" position = "fixed" onClick = {() => window.scrollTo({top: 0, behavior: "smooth"})} style = {{display:visible ? "inline" : "none"}}><FaArrowCircleUp style = {{display:"inline"}} />&nbsp;Scroll to Top</Button></Box>
    </Box>
    );
}