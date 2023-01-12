import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar.js';
import UseFetch from './UseFetch.js';
import Editor from './Editor.js';
import {
    Box,
    Button,
    Container,
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon} from '@chakra-ui/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function CommentForm(props) {
    const Navigate = useNavigate();
    const [content, setContent] = useState(props.content);
    const thread_id = props.thread_id;
    const isContentError = !(content.replace(/(<([^>]+)>)/gi, "").length > 20);
    const user_id = useSelector(state => state.id);

    const handleUpdateComment = (event) => {
        event.preventDefault();
        const data = {
            content: content,
            user_id: user_id,
        }
        fetch('http://localhost:4000/forum_threads/' + thread_id + '/comments/' + props.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => { redirectUpdate(data); })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const redirectUpdate = (data) => {
        console.log(data);
        Navigate("/threads/" + thread_id, { state: { typeNotification: "commentEdited" } });
    }

    return (
        <Container minWidth="80%" padding="0">
            <form onSubmit={handleUpdateComment}>
                <FormControl id="comment" label="Please enter your comment" isInvalid={isContentError} isRequired>
                    <FormLabel>Comment</FormLabel>
                    <Editor value={content} onChange={setContent} />
                    {!(isContentError) ? (<FormHelperText color="green.500"><CheckIcon color="green.500" />&nbsp; Nice!</FormHelperText>) : (<FormErrorMessage><WarningIcon color="red.500" />&nbsp;Please enter a longer comment</FormErrorMessage>)}
                </FormControl>
                <br />
                <Box display="flex" justifyContent="center" gap="3%">
                    <Button colorScheme={isContentError ? "red" : "green"} type="submit" disabled={isContentError}>Update comment</Button>
                    <Button colorScheme="red" onClick={() => Navigate("/threads/" + thread_id, { state: { typeNotification: "changesDiscarded" } })}>Discard changes</Button>
                </Box>
            </form>
            <br />
        </Container>
    );
}

export default function EditComment() {
    const state = useLocation().state;
    const accessLevel = state ? state.access : null;
    const Navigate = useNavigate();
    const ids = useParams().ids.split(":");
    const thread_id = parseInt(ids[0]);
    const id = parseInt(ids[1]);
    const user_id = useSelector(state => state.id);
    const comments = UseFetch("http://localhost:4000/forum_threads/" + thread_id + "/comments");
    console.log("http://localhost:4000/forum_threads/" + thread_id + "/comments");
    const comment = [...comments].find(comment => comment.id === id);
    if (comment && (comment.User_id === user_id || accessLevel === "moderator")) {
        return (
            <>
                <Box>
                    <Navbar />
                    <Box align="center">
                        <Heading>Edit Comment</Heading>
                    </Box>
                    <CommentForm id={id} thread_id={thread_id} content={comment.content} />
                </Box>
            </>
        );
    } else {
        Navigate("/");
    }
}