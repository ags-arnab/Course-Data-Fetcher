const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const cheerio = require('cheerio');

const clientId = 'frontend';
const redirectUri = 'https://usis.bracu.ac.bd/interim/';
const authUrl = 'https://usis.bracu.ac.bd/idp/realms/interim/protocol/openid-connect/auth';
const apiUrl = 'https://usis.bracu.ac.bd/interim/api/v1/offered-courses';

// Your login credentials
const username = 'username';
const password = 'password';

async function getAuthorizationCode() {
  try {
    // Step 1: Fetch the login page and extract cookies and the dynamic form action URL
    const loginPageResponse = await axios.get(authUrl, {
      params: {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid',
        state: 'random_state',
        nonce: 'random_nonce',
      },
      maxRedirects: 0, // Don't follow redirects
      validateStatus: (status) => status === 200 || status === 302, // Accept 200 and 302 statuses
    });

    const cookies = loginPageResponse.headers['set-cookie']; // Capture session cookies
    const responseBody = loginPageResponse.data;

    // Parse the login page to extract the form action URL
    const $ = cheerio.load(responseBody);
    const formAction = $('#kc-form-login').attr('action');

    if (!formAction) {
      throw new Error('Form action URL not found');
    }

    console.log('Form Action URL:', formAction);

    // Step 2: Submit login credentials to the extracted action URL
    const loginFormData = qs.stringify({
      username: username,
      password: password,
    });

    const loginResponse = await axios.post(formAction, loginFormData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies.join('; '), // Include session cookies from the login page
      },
      maxRedirects: 0, // Don't follow redirects
      validateStatus: (status) => status === 200 || status === 302, // Accept both 200 and 302 statuses
    });

    console.log('Login Response Headers:', loginResponse.headers);

    // Capture the redirection URL with the authorization code
    const redirectUrl = loginResponse.headers.location;
    if (!redirectUrl) {
      throw new Error('No redirection URL after login');
    }

    // Extract the authorization code from the redirect URL
    const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
    const authorizationCode = urlParams.get('code');

    if (!authorizationCode) {
      throw new Error('Authorization code not found');
    }

    return authorizationCode;
  } catch (error) {
    console.error('Error during login and authorization code retrieval:', error);
    throw error;
  }
}

async function exchangeCodeForToken(authorizationCode) {
  try {
    const tokenUrl = 'https://usis.bracu.ac.bd/idp/realms/interim/protocol/openid-connect/token';
    const tokenResponse = await axios.post(
      tokenUrl,
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        code: authorizationCode,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error during token exchange:', error);
    throw error;
  }
}

async function getJsonFile(accessToken) {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const jsonData = response.data;
    fs.writeFileSync('class-schedules.json', JSON.stringify(jsonData, null, 2));
    console.log('All details saved to class-schedules.json');
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    throw error;
  }
}

// Main function to orchestrate the flow
(async () => {
  try {
    const authorizationCode = await getAuthorizationCode();
    console.log('Authorization Code:', authorizationCode);

    const accessToken = await exchangeCodeForToken(authorizationCode);
    console.log('Access Token:', accessToken);

    await getJsonFile(accessToken);
  } catch (error) {
    console.error('Error during the process:', error.message);
  }
})();
