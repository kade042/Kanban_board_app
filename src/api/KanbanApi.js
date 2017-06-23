import 'whatwg-fetch';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com/';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'proreact',
};

let KanbanAPI = {
  fetchCards() {
    return fetch(`${API_URL}/cards`, {
      headers: API_HEADERS,
    })
    .then((response) => response.json());
  },
};

export default KanbanAPI;
