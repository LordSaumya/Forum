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
    Input,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { CheckIcon, WarningIcon} from '@chakra-ui/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function ThreadForm(props) {
    const Navigate = useNavigate();
    const [desc, setDesc] = useState(props.desc);
    const [title, setTitle] = useState(props.title);
    const [tag, setTag] = useState(props.tag);

    const threadsData = UseFetch("https://highgear.herokuapp.com/forum_threads");
    let usedTags = threadsData ? threadsData.map((thread) => thread.tag) : [];
    usedTags = Array.from(new Set(usedTags));

    const isTitleError = !(title.length > 10);
    const isDescError = !(desc.replace(/(<([^>]+)>)/gi, "").length > 50);
    const isTagError = tag === "";
    const user_id = useSelector(state => state.id);

    const handleUpdateThread = (event) => {
        event.preventDefault();
        const data = {
            title: title,
            description: desc,
            tag: tag,
            user_id: user_id,
        }
        fetch('https://highgear.herokuapp.com/forum_threads/' + props.id, {
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
        Navigate("/threads/" + props.id, { state: { typeNotification: "threadEdited" } });
    }

    return (
        <Container minWidth="80%" padding="0">
            <form onSubmit={handleUpdateThread}>
                <FormControl id="title" label="Please enter a title for your thread" isInvalid={isTitleError} isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input placeholder="Title of your thread" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                    <Box align="center">
                        <br />Existing Tags:<br />
                        <div style={{ overflowX: "scroll", whiteSpace: "nowrap", maxWidth: "80%", justifyContent: "center", display: "inline-block" }}>
                            {usedTags.map((tag) => <Button margin="5px" colorScheme="teal" key={tag} onClick={() => setTag(tag)}>{tag}</Button>)}
                        </div>
                    </Box>
                </FormControl>
                <br />
                <Box display="flex" justifyContent="center" gap="3%">
                    <Button colorScheme={isTitleError || isDescError || isTagError ? "grey" : "teal"} type="submit" disabled={isTitleError || isDescError || isTagError} variant="outline">Update Thread</Button>
                    <Button colorScheme="red" variant="outline" onClick={() => Navigate("/threads/" + props.id, { state: { typeNotification: "changesDiscarded" } })}>Discard changes</Button>
                </Box>
            </form>
            <br />
        </Container>
    );
}

export default function EditThread() {
    const state = useLocation().state;
    const accessLevel = state ? state.accessLevel : "";
    const Navigate = useNavigate();
    const id = useParams().id;
    const user_id = useSelector(state => state.id);
    const thread = UseFetch("https://highgear.herokuapp.com/forum_threads/" + id);
    if (thread && (thread.User_id === user_id || accessLevel === "moderator")) {
        return (
            <>
                <Box>
                    <Navbar />
                    <Box align="center">
                        <Heading>Edit Thread</Heading>
                    </Box>
                    <ThreadForm id={id} title={thread.title} desc={thread.description} tag={thread.tag} />
                </Box>
            </>
        );
    } else {
        Navigate("/");
    }
}