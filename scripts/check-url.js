import https from 'https';

const url = 'https://img1.pic.in.th/images/Favicon-Bocker168.png';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (err) => {
  console.error('Error:', err.message);
});
