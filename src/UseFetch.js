import { useState, useEffect } from 'react';

export default function UseFetch(url, request = "GET") {
    const [data, setData] = useState("");
    useEffect(() => {
        fetch(url, {
          method: request,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setData(data);
          })
          .catch((err) => {
            console.log(data);
            console.log(err.message);
          });
      }, [url, request]);
    return data;
}