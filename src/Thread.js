import React, { useEffect } from 'react';
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
    useToast,
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

function CommentForm() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const isContentError = !(content.replace(/(<([^>]+)>)/gi, "").length > 20);

    const user_id = useSelector(state => state.id);
    const threadID = useParams().id;

    const handleCreateComment = (event) => {
        if (!isContentError) {
            event.preventDefault();
            console.log(content);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ User_id: user_id, ForumThread_id: threadID, content: content })
            };
            fetch('http://localhost:4000/forum_threads/' + threadID + "/comments", requestOptions)
                .then(response => response.json())
                .then(data => refreshCreate(data))
                .catch(err => console.log(err));
        } else {
            event.preventDefault();
            window.alert("Error: Please enter a longer comment");
        }
    }

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
                <Button colorScheme={isContentError ? "red" : "green"} type="submit" disabled={isContentError}>Post Comment</Button>
            </form>
        </Container>
    );
}

function ThreadContainer(props) {
    const Navigate = useNavigate();
    const [show, setShow] = React.useState(false)
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("http://localhost:4000/users/" + props.User_id);
    const handleToggle = () => setShow(!show)
    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);

    const redirectDelete = (data) => {
        console.log(data);
        Navigate("/", { state: { typeNotification: "threadDeleted" } });
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
                {props.User_id === useSelector(state => state.id) ? (
                    <>
                        <Divider paddingTop="10px" />
                        <Box display="flex" justifyContent="center" gap="3%" margin="10px">
                            <Button colorScheme="red" onClick={handleDelete}>Delete Thread</Button>
                            <Button colorScheme="blue" onClick={() => Navigate("/editThread/" + props.id)}>Edit Thread</Button>
                        </Box>
                    </>
                ) : (<></>)}
            </Container>
        </div>
    );
}

function CommentContainer(props) {
    const Navigate = useNavigate();
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("http://localhost:4000/users/" + props.user_id);
    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);

    const refreshDelete = (data) => {
        console.log(data);
        Navigate("/ParamNavigator", { state: { typeNotification: "commentDeleted", page: "threads/" + props.threadID } });
    }

    const handleDelete = (event) => {
        console.log(props.id)
        if (window.confirm("Are you sure you want to delete this comment?")) {
            event.preventDefault();
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch("http://localhost:4000/forum_threads/" + props.threadID + "/comments/" + props.id, requestOptions)
                .then(response => response.json())
                .then(data => refreshDelete(data))
                .catch(err => console.log(err));
        }
    }


    return (
        <LazyLoad height={200}>
            <Container boxShadow="md" minWidth="80%" padding="10px" name="commentContainer" marginBottom="10px" border={isMod ? "1px" : "0px"} borderColor={isMod ? "gold" : "white"}>
                <Text fontSize="sm" color="gray.500">Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
                {isMod ? <>
                    <Badge ml='1' colorScheme='yellow' float="right" name="mod" top="2px">
                        Moderator Comment
                    </Badge>
                    <br />
                </>
                    : <></>
                }
                <Divider paddingTop="10px" />
                <Box padding="10px" dangerouslySetInnerHTML={{ __html: props.content }} name="commentContent">
                </Box>
                {props.user_id === useSelector(state => state.id) ? (
                    <>
                        <Divider paddingTop="10px" />
                        <Box display="flex" justifyContent="center" gap="3%" margin="10px">
                            <Button colorScheme="red" onClick={handleDelete}>Delete comment</Button>
                            <Button colorScheme="blue" onClick={() => Navigate("/editComment/" + props.threadID + ":" + props.id)}>Edit comment</Button>
                        </Box>
                    </>
                ) : (<></>)}
            </Container>
        </LazyLoad>
    );
}


export default function Thread() {
    const navigate = useNavigate();
    const threadID = useParams().id;
    const [showForm, setShowForm] = React.useState(false)
    const thread = UseFetch("http://localhost:4000/forum_threads/" + threadID);
    const toast = useToast();
    const location = useLocation();
    let notif = location.state ? location.state.typeNotification : null;

    useEffect(() => {
        if (notif) {
            let [toastTitle, toastDesc, toastStatus] = [null, null, null];
            if (notif === "threadCreated") {
                toastTitle = "Thread created";
                toastDesc = "Your thread is live!";
                toastStatus = "success";
            } else if (notif === "threadEdited") {
                toastTitle = "Thread edited";
                toastDesc = "Your thread has been edited!";
                toastStatus = "success";
            } else if (notif === "commentEdited") {
                toastTitle = "Comment edited";
                toastDesc = "Your comment has been edited!";
                toastStatus = "success";
            } else if (notif === "changesDiscarded") {
                toastTitle = "Changes discarded";
                toastDesc = "Your changes have been discarded";
                toastStatus = "error";
            } else if (notif === "commentDeleted") {
                toastTitle = "Comment deleted";
                toastDesc = "Your comment has been deleted";
                toastStatus = "error";
            } else if (notif === "commentCreated") {
                toastTitle = "Comment created";
                toastDesc = "Your comment has been posted";
                toastStatus = "success";
            }
            toast({
                title: toastTitle,
                description: toastDesc,
                status: toastStatus,
                duration: 5000,
                isClosable: true,
            });
            notif = null;
        }
    }, []);

    let btnText = showForm
        ? (<Text style={{ display: "inline" }}><CloseIcon style={{ display: "inline" }} /><Text style={{ display: "inline" }}>&nbsp;&nbsp;Close editor</Text></Text>)
        : (<Text style={{ display: "inline" }}><ChatIcon style={{ display: "inline" }} /><Text style={{ display: "inline" }}>&nbsp;&nbsp;Add a comment</Text></Text>)

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
        } else {
            return commentsData;
        }
    }) : null;

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
            {sortedComments ? sortedComments.map((com) => <CommentContainer id={com.id} date={com.created_at} user_id={com.User_id} key={com.id} content={com.content} threadID={com.ForumThread_id} />) : (<Box align="center"><Spinner size="xl" /></Box>)}
            <br /><Box align="center" float="left" style={{ display: "inline" }}><Button id="scrollToTopBtn" bottom="10px" position="fixed" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: visible ? "inline" : "none" }}><FaArrowCircleUp style={{ display: "inline" }} />&nbsp;Scroll to Top</Button></Box>
        </Box>
    );
}