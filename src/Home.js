//Imports
import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import Editor from './Editor.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import { FaArrowCircleUp } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import moderatorList from './moderatorsList.json';
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
import { useSelector } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import Toast from './Toast.js';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

//Body

//Form to create thread
function ThreadForm() {
    const [desc, setDesc] = useState("");
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const Navigate = useNavigate();

    //Fetches existing tags
    const threadsData = UseFetch("https://highgear.herokuapp.com/forum_threads");
    let usedTags = threadsData ? threadsData.map((thread) => thread.tag) : [];
    usedTags = Array.from(new Set(usedTags));

    const isTitleError = !(title.length > 10);
    const isDescError = !(desc.replace(/(<([^>]+)>)/gi, "").length > 50);
    const isTagError = tag === "";

    const user_id = useSelector(state => state.id);

    //Creates thread
    const handleCreateThread = (event) => {
        event.preventDefault();
        console.log("Creating thread");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ User_id: user_id, title: title, description: desc, tag: tag })
        };
        fetch('https://highgear.herokuapp.com/forum_threads', requestOptions)
            .then(response => response.json())
            .then(data => refreshCreate(data))
            .catch(err => console.log(err));
    }

    //Refreshes page after thread creation
    const refreshCreate = (data) => {
        console.log(data);
        Navigate("/threads/" + data.id, { state: { typeNotification: "threadCreated" } });
    }

    return (
        <Container minWidth="80%" padding="0">
            <form onSubmit={handleCreateThread}>
                <FormControl id="title" label="Please enter a title for your thread" isInvalid={isTitleError} isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input placeholder="Title of your thread" onChange={(e) => setTitle(e.target.value)} />
                    {!(isTitleError) ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp; Great title!</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer title</FormErrorMessage>)}
                </FormControl>
                <br />
                <FormControl id="description" label="Please enter a description of the thread" isInvalid={isDescError} isRequired>
                    <FormLabel>Description</FormLabel>
                    <Editor value={desc} onChange={setDesc} />
                    {!(isDescError) ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp; Nice!</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer description</FormErrorMessage>)}
                </FormControl>
                <br />
                <FormControl id="tag" label="Please enter a tag for your thread" isInvalid={isTagError} isRequired>
                    <FormLabel>Tag</FormLabel>
                    <Input placeholder="Tag of your thread" value={tag} onChange={(e) => setTag(e.target.value)} />
                    {!(isTagError) ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp; Great tag!</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a tag</FormErrorMessage>)}
                    <br />Existing Tags:<br />
                    <div style={{ overflowX: "scroll", whiteSpace: "nowrap", maxWidth: "80%", justifyContent: "center", display: "inline-block" }}>
                        {usedTags.map((tag) => <Button margin="5px" colorScheme="teal" key={tag} onClick={() => setTag(tag)}>{tag}</Button>)}
                    </div>
                </FormControl>
                <br />
                <Button type="submit" variant="outline" id = "submitBtn" colorScheme={isTitleError || isDescError || isTagError ? "grey" : "teal"} disabled={isTitleError || isDescError || isTagError}>Post Thread</Button>
            </form>
        </Container>
    );
}

//Container for threads
function ThreadContainer(props) {
    const [show, setShow] = React.useState(false)
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("https://highgear.herokuapp.com/users/" + props.user_id);

    //Handles visibility of the content
    const handleToggle = () => setShow(!show)

    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    const isMod = mods.includes(author.username);

    return (
        <LazyLoad>
            <div className='ql-editor' style={{ margin: "0px", padding: "0px" }}>
                <Container boxShadow="md" minWidth="80%" padding="10px" name="threadContainer" marginBottom="10px" border={isMod ? "1px" : "0px"} borderColor={isMod ? "gold" : "white"}>
                    <Badge ml='1' colorScheme='green' float="right" name="threadTag">
                        {props.tag}
                    </Badge>
                    {isMod ?
                        <Badge ml='1' colorScheme='yellow' float="right" name="mod">
                            Moderator Post
                        </Badge>
                        : <></>
                    }
                    <a href={"./Threads/" + props.id}><Heading size="md" name="threadTitle">{props.title}</Heading>
                        <Text fontSize="sm" color="gray.500">Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
                        <Divider paddingTop="10px" /><br />
                        <Collapse startingHeight="80px" in={show} padding="10px" dangerouslySetInnerHTML={{ __html: props.desc }} name="threadDesc">
                        </Collapse>
                    </a>
                    <Button size='sm' onClick={handleToggle} mt='1rem'>
                        Show {show ? 'less' : 'all'}
                    </Button>
                </Container>
            </div>
        </LazyLoad>
    );
}

// Main container for home page
export default function Home() {
    const location = useLocation();
    let notif = location.state ? location.state.typeNotification : null;

    // Provides toast functionality using location parameters.
    Toast(notif);

    //Toggles visibility between form and threads
    const [showForm, setShowForm] = React.useState(false)
    const [showThreads, setShowThreads] = React.useState(true)
    let btnText = showThreads
        ? (<Text style={{ display: "inline" }}><AddIcon style={{ display: "inline" }} /><Text style={{ display: "inline" }}>&nbsp;&nbsp;Create thread</Text></Text>)
        : (<Text style={{ display: "inline" }}><ChatIcon style={{ display: "inline" }} /><Text style={{ display: "inline" }}>&nbsp;&nbsp;Show threads</Text></Text>)

    const handleToggle = () => {
        setShowForm(!showForm)
        setShowThreads(!showThreads)
    }

    const threadsData = UseFetch("https://highgear.herokuapp.com/forum_threads");
    const [sort_by, setSort_by] = React.useState("date");
    const [reverse, setReverse] = React.useState(false);

    //Sorts threads by date, title, or tag
    const sortedThreads = threadsData ? threadsData.sort((a, b) => {
        if (sort_by === "date") {
            return reverse ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
        } else if (sort_by === "title") {
            return reverse ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sort_by === "tag") {
            return reverse ? a.tag.localeCompare(b.tag) : b.tag.localeCompare(a.tag);
        }
        else {
            return threadsData;
        }
    }) : null;

    //Searches threads by title, description, or tag
    function Search(item) {
        var thread = document.getElementsByName("threadContainer");
        var numResults = 0;
        var threadTitle = document.getElementsByName("threadTitle");
        var threadDesc = document.getElementsByName("threadDesc");
        var threadTag = document.getElementsByName("threadTag");
        var noResults = document.getElementById("noResults");
        item = item.toLowerCase();

        for (let i = 0; i < thread.length; i++) {
            if (((((threadDesc[i].innerHTML).replace(/(<([^>]+)>)/gi, "")).toLowerCase()).indexOf(item) > -1) || (((threadTag[i].innerHTML).toLowerCase()).indexOf(item) > -1) || (((threadTitle[i].innerHTML).toLowerCase()).indexOf(item) > -1)) {
                numResults += 1;
                thread[i].style.display = "block";
            } else {
                thread[i].style.display = "none";
            }
        }
        if (numResults === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }

    //Toggles visibility of scroll to top button
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
            <Box align="center">
                <Button id="toggleButton" colorScheme='teal' variant="outline" onClick={handleToggle} top="0px" margin="10px">
                    {btnText}
                </Button>
            </Box><br />
            <Collapse in={showForm} animateOpacity>
                <Box align="center" id="ThreadForm">
                    <ThreadForm />
                </Box>
            </Collapse>
            <Collapse in={showThreads} animateOpacity>
                <Box align="center" style={{ display: "flex", justifyContent: "center", gap: "10px", verticalAlign: "middle" }}><Search2Icon />&nbsp;&nbsp;<Input width="50%" id="search" placeholder="Search for a thread" onChange={(e) => Search(e.target.value)} />
                    <Select id="sort" onChange={(e) => setSort_by(e.target.value)} width="9%">
                        <option value="date">Date</option>
                        <option value="title">Title</option>
                        <option value="tag">Tag</option>
                    </Select>
                    <Button onClick={() => setReverse(!reverse)}>{reverse ? <TriangleUpIcon /> : <TriangleDownIcon />}</Button>
                </Box>< br />
                <Box align="center" id="noResults" style={{ display: "none" }}><Text>No results found</Text></Box>
                {sortedThreads ? sortedThreads.map((thread) => <ThreadContainer id={thread.id} date={thread.created_at} user_id={thread.User_id} key={thread.id} title={thread.title} desc={thread.description} tag={thread.tag} />) : (<Box align="center"><Spinner size="xl" /></Box>)}
                <br /><Box align="center" float="left" style={{ display: "inline" }}><Button id="scrollToTopBtn" bottom="10px" position="fixed" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: visible ? "inline" : "none" }}><FaArrowCircleUp style={{ display: "inline" }} />&nbsp;Scroll to Top</Button></Box>
            </Collapse>
        </Box>
    );
}