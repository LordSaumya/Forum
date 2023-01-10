import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import Editor from './Editor.js';
import LazyLoad from 'react-lazyload';
import moment from 'moment';
import { FaArrowCircleUp, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import moderatorList from './moderatorsList.json';
import {
    useColorModeValue,
    useToast,
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
    Table,
    FormLabel,
    Spinner,
    FormErrorMessage,
    FormHelperText,
    Collapse,
    Input,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import { CheckIcon, WarningIcon, AddIcon, ChatIcon, TriangleDownIcon, TriangleUpIcon, Search2Icon, DeleteIcon } from '@chakra-ui/icons';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
const bcrypt = require('bcryptjs');

function ThreadContainer(props) {
    const Navigate = useNavigate();
    const username = useParams().username;
    const author = UseFetch("http://localhost:4000/users/" + props.User_id);
    const comments = UseFetch("http://localhost:4000/forum_threads/" + props.id + "/comments");
    const timeAgo = moment(props.date).fromNow();

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this thread?")) {
            fetch('http://localhost:4000/forum_threads/' + props.id, {
                method: 'DELETE',
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    Navigate("/ParamNavigator", { state: { typeNotification: "threadDeleted", page: "ModDashboard" } });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const handleUpdate = () => {
        Navigate("/editThread/" + props.id, { state: { access: "moderator" } });
    }


    return (<>
        <Box display="flex" justifyContent="flex-start" alignItems="center" height="50px" border="1px" borderRadius="5px" padding="10px" margin="5px">
            <Button onClick={handleDelete} colorScheme="red" size="sm" variant="outline"><FaTrashAlt /></Button>
            &nbsp;
            <Button onClick={handleUpdate} colorScheme="green" size="sm" variant="outline"><FaPencilAlt /></Button>
            &nbsp;&nbsp;
            <Divider orientation="vertical" />
            &nbsp;&nbsp;
            <Link maxWidth="40vw" overflow="hidden" href={"/threads/" + props.id}><Heading size="md">{props.title}</Heading></Link>
            <Text fontSize="sm" color="gray.500">&nbsp;&nbsp;Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
        </Box>
        {comments ? comments.map((comment) => <CommentContainer user_id={comment.User_id} id={comment.id} ForumThread_id={comment.ForumThread_id} content={comment.content} date={comment.created_at}></CommentContainer>) : <></>}
    </>);
}

function CommentContainer(props) {
    const Navigate = useNavigate();
    const timeAgo = moment(props.date).fromNow();
    const author = UseFetch("http://localhost:4000/users/" + props.user_id);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            fetch('http://localhost:4000/forum_threads/' + props.ForumThread_id + '/comments/' + props.id, {
                method: 'DELETE',
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    Navigate("/ParamNavigator", { state: { typeNotification: "commentDeleted", page: "ModDashboard" } });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const handleUpdate = () => {
        Navigate("/editComment/" + props.ForumThread_id + ":" + props.id, { state: { access: "moderator" } });
    }

    return (
        <Box display="flex" justifyContent="flex-start" alignItems="left" height="50px" border="1px" borderRadius="5px" padding="10px" margin="5px" width="80%">
            <Button onClick={handleDelete} colorScheme="red" size="sm" display="block" variant="outline"><FaTrashAlt /></Button>
            &nbsp;
            <Button onClick={handleUpdate} colorScheme="green" display="block" size="sm" variant="outline"><FaPencilAlt /></Button>
            &nbsp;&nbsp;
            <Divider orientation="vertical" />
            &nbsp;&nbsp;
            <Link maxWidth="40vw" maxHeight="200px" overflow="hidden" href={"/threads/" + props.ForumThread_id}><Heading size="md"><div dangerouslySetInnerHTML={{ __html: props.content }}></div></Heading></Link>
            <Text fontSize="sm" color="gray.500">&nbsp;&nbsp;Posted by <Link href={"/ProfilePage/" + (author ? author.username : "")} color="teal.500" >{author ? author.username : ""}</Link> {timeAgo}</Text>
        </Box>
    );
}

function DeleteAccount() {
    const id = useSelector(state => state.id);
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [passwordInput, setPasswordInput] = React.useState('');
    const userData = UseFetch('http://localhost:4000/users/' + id);
    const isPasswordError = passwordInput.length === 0 || (userData && !bcrypt.compareSync(passwordInput, userData.password));

    const handlePasswordChange = (event) => {
        setPasswordInput(event.target.value);
    }

    const logOutOnDelete = () => {
        const action = { type: "LOGOUT" };
        dispatch(action);
    }


    const handleDeleteSubmit = () => {
        if (!isPasswordError && window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch('http://localhost:4000/users/' + id, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Account deleted successfully!");
                    console.log(data);
                    logOutOnDelete();
                    Navigate("/Registration", { state: { typeNotification: "deletedAccount" } });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }
    return (
        <Box width="60%">
            <Text fontSize="sm" color="red.500"><WarningIcon /> This action is irreversible. All of your content will be deleted.</Text><br />
            <FormControl id="password" isInvalid={isPasswordError} isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Password" onChange={handlePasswordChange} />
                {!isPasswordError ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp;Your password is correct</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;This password is incorrect.</FormErrorMessage>)}
            </FormControl><br />
            <Button onClick={handleDeleteSubmit} colorScheme={isPasswordError ? "red" : "green"} size="sm" variant="outline" disabled={isPasswordError}>Submit</Button><br />
        </Box>
    );
}

function UserContainer(props) {
    const username = props.username;
    return (
        <Box display="flex" justifyContent="flex-start" alignItems="center" height="50px" border="1px" borderRadius="5px" padding="10px" margin="5px">
            <Link maxWidth="40vw" overflow="hidden" href={"/ProfilePage/" + username}><Heading size="md">{username}</Heading></Link>
        </Box>
    );
}

export default function ModDashboard() {
    const navigate = useNavigate();
    const mods = JSON.parse(JSON.stringify(moderatorList)).moderators;
    mods.includes(useSelector(state => state.username)) ? console.log("User is a moderator") : navigate("/", { state: { typeNotification: "permissionDenied" } });;
    let userData = UseFetch('http://localhost:4000/users');
    userData = userData ? userData : [];
    const threads = UseFetch('http://localhost:4000/forum_threads');

    const toast = useToast();
    const location = useLocation();
    let notif = location.state ? location.state.typeNotification : false;
    useEffect(() => {
        if (notif) {
            let [toastTitle, toastDesc, toastStatus] = [null, null, null];
            if (notif === "threadDeleted") {
                toastTitle = "Thread deleted";
                toastDesc = "Your thread has been deleted.";
                toastStatus = "error";
            } else if (notif === "commentDeleted") {
                toastTitle = "Comment deleted";
                toastDesc = "Your comment has been deleted.";
                toastStatus = "error";
            } else if (notif === "emailChanged") {
                toastTitle = "Email changed";
                toastDesc = "Your email has been changed.";
                toastStatus = "success";
            } else if (notif === "passwordChanged") {
                toastTitle = "Password changed";
                toastDesc = "Your password has been changed.";
                toastStatus = "success";
            } else if (notif === "deletedAccount") {
                toastTitle = "Account deleted.";
                toastDesc = "The account has been deleted.";
                toastStatus = "warning";
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

    return (
        <Box>
            <Navbar currentPage="moderator" />
            <Box align="center">
                <Heading>Moderator Dashboard</Heading>< br />
                <br />
                <Divider />
                <br />
                <Box display="flex">
                    <Box flex="3">
                        <Heading size="md">All Content</Heading>
                        <br />
                        <Box display="flex">
                            <Box align="center" flex="50%" borderRight="1px">
                                <div style={{ overflowY: "scroll", overflowX: "hidden", whiteSpace: "nowrap", maxHeight: "400px", justifyContent: "center", display: "inline-block" }}>
                                    {threads ? threads.map((thread) => <ThreadContainer key={thread.id} id={thread.id} title={thread.title} User_id={thread.User_id} date={thread.created_at} />) : <></>}
                                </div>
                                {threads ? threads.length === 0 ? <Text>No content posted</Text> : <></> : <></>}
                            </Box>
                        </Box>
                    </Box>
                    <Box flex="1">
                        <Heading size="md">All Users</Heading>
                        <br />
                        <Box display="flex">
                            <Box align="center" flex="50%" borderRight="1px">
                                <div style={{ overflowY: "scroll", overflowX: "hidden", whiteSpace: "nowrap", maxHeight: "400px", justifyContent: "center", display: "inline-block" }}>
                                    {userData ? userData.map((user) => <UserContainer key={user.id} username={user.username} />) : <></>}
                                </div>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <br />
        </Box>
    );
}