import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { useState } from 'react';

const toolbarOptions = [['bold', 'italic', 'underline', 'strike'],
['code-block'],

[{ 'header': 1 }, { 'header': 2 }],
[{ 'list': 'ordered' }, { 'list': 'bullet' }],
[{ 'script': 'sub' }, { 'script': 'super' }],
[{ 'indent': '-1' }, { 'indent': '+1' }],

[{ 'size': ['small', false, 'large', 'huge'] }],

[{ 'color': [] }, { 'background': [] }],
[{ 'font': [] }],
[{ 'align': [] }],

['clean'],

['link', 'image']
];

export default function Editor(props) {
    return <ReactQuill theme="snow" value={props.value} onChange={props.onChange} modules={{ toolbar: toolbarOptions }} />;
}