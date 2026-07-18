const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  const form = new FormData();
  form.append('file', Buffer.from('hello world'), 'test.txt');

  try {
    const res = await axios.post('http://httpbin.org/post', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(res.data.files);
  } catch (e) {
    console.error(e.message);
  }
}
test();
