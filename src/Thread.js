//Imports
import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import Editor from './Editor.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import moderatorList from './moderatorsList.json';
import { FaArrowCircleUp } from 'react-icons/fa';
import {
    Box,
    Text,
    Link,
    Badge,
    Select,
    Button,
    Container,
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
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon, CloseIcon } from '@chakra-ui/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Toast from './Toast.js';

//Body

//Form for creating a new comment
function CommentForm() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const isContentError = !(content.replace(/(<([^>]+)>)/gi, "").length > 20);

    const user_id = useSelector(state => state.id);
    const threadID = useParams().id;
    //Creates new comment
    const handleCreateComment = (event) => {
        if (!isContentError) {
            event.preventDefault();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ User_id: user_id, forumthread_id: parseInt(threadID), content: content })
            };
            fetch('https://highgear.herokuapp.com/forum_threads/' + threadID + "/comments", requestOptions)
                .then(response => response.json())
                .then(data => refreshCreate(data))
                .catch(err => console.log(err));
        } else {
            event.preventDefault();
            window.alert("Error: Please enter a longer comment");
        }
    }

    //Refreshes page with location parameters
    const refreshCreate = (data) => {
        console.log("Refreshing page")
        console.log(data);
        navigate("/ParamNavigator", { state: { typeNotification: "commentCreated", page: "threads/" + threadID } });
    }

    return (
        <Container minWidth="80%" padding="0">
            <form onSubmit={handleCreateComment}>
                <br />
                <FormControl id="description" label="Please enter your comment" isInvalid={isContentError} isRequired>
                    <FormLabel>Comment</FormLabel>
                    <Editor value={content} onChange={setContent} />
                    {!(isContentError) ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp; Nice!</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer comment</FormErrorMessage>)}
                </FormControl>
                <br />
                <Button colorScheme={isContentError ? "grey" : "teal"} type="submit" disabled={isContentError}>Post Comment</Button>
            </form>
        </Container>
    );
}

//Container for thread
function ThreadContainer(props) {
    const Navigate = useNavigate();
    const [show, setShow] = React.useState(false)
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("https://highgear.herokuapp.com/users/" + props.User_id);
    const handleToggle = () => setShow(!show)
    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);

    //Deletes thread
    const handleDelete = (event) => {
        console.log(props.id)
        if (window.confirm("Are you sure you want to delete this thread?")) {
            event.preventDefault();
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch('https://highgear.herokuapp.com/forum_threads/' + props.id, requestOptions)
                .then(response => response.json())
                .then(data => redirectDelete(data))
                .catch(err => console.log(err));
        }
    }

    //Redirects user to home page.
    const redirectDelete = (data) => {
        console.log(data);
        Navigate("/", { state: { typeNotification: "threadDeleted" } });
    }

    return (
        <div className='ql-editor' style={{ margin: "0px", padding: "0px" }}>
            <Container boxShadow="md" minWidth="90%" padding="10px" name="threadContainer" marginBottom="10px" border={isMod ? "1px" : "0px"} borderColor={isMod ? "gold" : "white"}>
                <Badge ml='1' colorScheme='green' float="right" name="threadTag">
                    {props.tag}
                </Badge>
                {isMod ?
                    <Badge ml='1' colorScheme='yellow' float="right" name="mod">
                        Moderator Post
                    </Badge>
                    : <></>
                }
                <Heading size="md" name="threadTitle">{props.title}</Heading>
                <Text fontSize="sm" color="gray.500">Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
                <Divider paddingTop="10px" /><br />
                <Collapse startingHeight="80px" in={show} padding="10px" dangerouslySetInnerHTML={{ __html: props.desc }} name="threadDesc">
                </Collapse>
                <Button size='sm' onClick={handleToggle} mt='1rem'>
                    Show {show ? 'less' : 'all'}
                </Button>
                {/* Only renders edit and delete options if the thread was created by the user */}
                {props.User_id === useSelector(state => state.id) ? (
                    <>
                        <Divider paddingTop="10px" />
                        <Box display="flex" justifyContent="center" gap="3%" margin="10px">
                            <Button colorScheme="red" onClick={handleDelete}>Delete Thread</Button>
                            <Button colorScheme="teal" onClick={() => Navigate("/editThread/" + props.id)}>Edit Thread</Button>
                        </Box>
                    </>
                ) : (<></>)}
            </Container>
        </div>
    );
}

//Container for comments
function CommentContainer(props) {
    //TODO: Add OP badge
    const Navigate = useNavigate();
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("https://highgear.herokuapp.com/users/" + props.user_id);
    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);
    const isAuthor = props.user_id === props.thread_author_id;

    //Deletes comment
    const handleDelete = (event) => {
        console.log(props.id)
        if (window.confirm("Are you sure you want to delete this comment?")) {
            event.preventDefault();
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch("https://highgear.herokuapp.com/forum_threads/" + props.threadID + "/comments/" + props.id, requestOptions)
                .then(response => response.json())
                .then(data => refreshDelete(data))
                .catch(err => console.log(err));
        }
    }

    //Refreshes page with location parameters
    const refreshDelete = (data) => {
        console.log(data);
        Navigate("/ParamNavigator", { state: { typeNotification: "commentDeleted", page: "threads/" + props.threadID } });
    }


    return (
        <LazyLoad height={200}>
            <Container boxShadow="md" minWidth="80%" padding="10px" name="commentContainer" marginBottom="10px" border={isMod ? "1px" : "0px"} borderColor={isMod ? "gold" : "white"}>
                <Text fontSize="sm" color="gray.500">Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
                {isMod ? <>
                    <Badge ml='1' colorScheme='yellow' float="right" name="mod" top="2px">
                        Moderator Comment
                    </Badge>
                    {isAuthor ? <></> : <br />}
                </>
                    : <></>
                }
                {isAuthor ? <>
                    <Badge ml='1' colorScheme='blue' float="right" name="author" top="2px">
                        OP
                    </Badge>
                    <br />
                </>
                    : <></>
                }
                <Divider paddingTop="10px" />
                <Box padding="10px" dangerouslySetInnerHTML={{ __html: props.content }} name="commentContent">
                </Box>
                {/* Only renders edit and delete options if the comment was created by the user */}
                {props.user_id === useSelector(state => state.id) ? (
                    <>
                        <Divider paddingTop="10px" />
                        <Box display="flex" justifyContent="center" gap="3%" margin="10px">
                            <Button colorScheme="red" onClick={handleDelete}>Delete comment</Button>
                            <Button colorScheme="teal" onClick={() => Navigate("/editComment/" + props.threadID + ":" + props.id)}>Edit comment</Button>
                        </Box>
                    </>
                ) : (<></>)}
            </Container>
        </LazyLoad>
    );
}

// Main container for the thread page
export default function Thread() {
    const threadID = useParams().id;
    const [showForm, setShowForm] = React.useState(false)
    const thread = UseFetch("https://highgear.herokuapp.com/forum_threads/" + threadID);
    const location = useLocation();
    let notif = location.state ? location.state.typeNotification : null;

    // Provides toast functionality using location parameters.
    Toast(notif);

    //Toggles the comment form
    let btnText = showForm
        ? (<Text style={{ display: "inline" }}><CloseIcon style={{ display: "inline" }} /><Text style={{ display: "inline" }}>&nbsp;&nbsp;Close editor</Text></Text>)
        : (<Text style={{ display: "inline" }}><ChatIcon style={{ display: "inline" }} /><Text style={{ display: "inline" }}>&nbsp;&nbsp;Add a comment</Text></Text>)

    const handleToggle = () => {
        setShowForm(!showForm)
    }

    const commentsData = UseFetch("https://highgear.herokuapp.com/forum_threads/" + threadID + "/comments");
    const [sort_by, setSort_by] = React.useState("date");
    const [reverse, setReverse] = React.useState(false);

    // Sorts comments by date or content
    const sortedComments = commentsData ? commentsData.sort((a, b) => {
        if (sort_by === "date") {
            return reverse ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
        } else if (sort_by === "content") {
            return reverse ? b.content.localeCompare(a.content) : a.content.localeCompare(b.content);
        } else {
            return commentsData;
        }
    }) : null;

    // Search function for comments (by content)
    function Search(item) {
        var comment = document.getElementsByName("commentContainer");
        var numResults = 0;
        var commentContent = document.getElementsByName("commentContent");
        var noResults = document.getElementById("noResults");
        item = item.toLowerCase();

        for (let i = 0; i < comment.length; i++) {
            if (((((commentContent[i].innerHTML).replace(/(<([^>]+)>)/gi, "")).toLowerCase()).indexOf(item) > -1)) {
                numResults += 1;
                comment[i].style.display = "block";
            } else {
                comment[i].style.display = "none";
            }
        }
        if (numResults === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }

    // Toggles the visibility of the scroll to top button
    const [visible, setVisible] = useState(false)
    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        }
        else if (scrolled <= 300) {
            setVisible(false)
        }
    }
    window.addEventListener('scroll', toggleVisible);

    return (
        <Box>
            <Navbar currentPage="home" />
            <Box id="threadContainer">
                {thread ? <ThreadContainer date={thread.created_at} title={thread.title} desc={thread.description} tag={thread.tag} User_id={thread.User_id} id={thread.id} /> : <Box align="center"><Spinner size="xl" /></Box>}
            </Box><br />
            <Box align="center" style={{ display: "flex", justifyContent: "center", gap: "10px", verticalAlign: "middle" }}><Search2Icon />&nbsp;&nbsp;<Input width="50%" id="search" placeholder="Search for a comment" onChange={(e) => Search(e.target.value)} />
                <Select id="sort" onChange={(e) => setSort_by(e.target.value)} width="9%">
                    <option value="date">Date</option>
                    <option value="content">Content</option>
                </Select>
                <Button onClick={() => setReverse(!reverse)}>{reverse ? <TriangleUpIcon /> : <TriangleDownIcon />}</Button>
            </Box>< br />
            <Box align="center">
                <Button id="toggleButton" colorScheme='cyan' onClick={handleToggle} top="0px" margin="10px">
                    {btnText}
                </Button>
            </Box>
            <Collapse in={showForm} animateOpacity>
                <Box align="center" id="CommentForm">
                    <CommentForm />
                </Box>
            </Collapse>
            <Box align="center" id="noResults" style={{ display: "none" }}><Text>No results found</Text></Box>
            {sortedComments ? sortedComments.map((com) => <CommentContainer thread_author_id = {thread.User_id} id={com.id} date={com.created_at} user_id={com.User_id} key={com.id} content={com.content} threadID={com.ForumThread_id} />) : (<Box align="center"><Spinner size="xl" /></Box>)}
            <br /><Box align="center" float="left" style={{ display: "inline" }}><Button id="scrollToTopBtn" bottom="10px" position="fixed" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: visible ? "inline" : "none" }}><FaArrowCircleUp style={{ display: "inline" }} />&nbsp;Scroll to Top</Button></Box>
        </Box>
    );
}