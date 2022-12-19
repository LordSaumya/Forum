import { useState, useEffect } from 'react';
import axios from 'axios';

function UseFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      setLoading('loading...')
      setData(null);
      setError(null);
      const source = axios.CancelToken.source();
      axios.get(url, { cancelToken: source.token })
      .then(res => {
          setLoading(false);
          res.data.content && setData(res.data.content);
          res.content && setData(res.content);
      })
      .catch(err => {
          setLoading(false)
          setError('An error occurred.')
      })
      return () => {
          source.cancel();
      }
  }, [url])

  return { data, loading, error }
}
export default UseFetch;