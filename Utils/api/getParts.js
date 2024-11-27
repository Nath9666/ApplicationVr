import axios from 'axios';

const getParts = async () => {
  const url = 'https://rebrickable.com/api/v3/lego/parts/?page=1&page_size=1000';
  const headers = {
    'Accept': 'application/json',
    'Authorization': 'key d3dae823e10d9dd6872e861f3e2193a2'
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching parts:', error);
  }
};

getParts().then((data) => console.log(data.results.len()));