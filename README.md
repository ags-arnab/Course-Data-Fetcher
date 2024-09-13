
# Course Data Fetcher

This Node.js script automates the process of logging into a university system, retrieving course schedules and data, and saving them as a JSON file. It uses **OAuth 2.0** authentication to securely access a protected API and gather the necessary information.

---

## Features

- **Automated Login:** Automatically logs into the university system using credentials and handles the session.
- **OAuth 2.0 Flow:** Uses the authorization code grant type to retrieve an access token.
- **Fetch Course Data:** Retrieves data on offered courses from the API and stores it locally.
- **JSON Output:** Saves the data as a formatted JSON file (`class-schedules.json`).

---

## Prerequisites

- **Node.js** (v12 or higher)
- **npm** (for package installation)

You will also need your **university system login credentials** to access the system.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/course-data-fetcher.git
   cd course-data-fetcher
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

---

## Usage

1. Open the script and add your login credentials in the appropriate section:
   ```javascript
   const username = 'username';
   const password = 'password';
   ```

2. Run the script:
   ```bash
   node script.js
   ```

3. Once the script completes, the course data will be saved in a file named `class-schedules.json`.

---

## How It Works

1. **Login Page Scraping:** The script fetches the login page and extracts the dynamic form action URL using `cheerio`.
2. **Submitting Credentials:** It sends your login credentials to the extracted form URL, along with session cookies.
3. **OAuth Flow:** After logging in, the script captures the authorization code from the redirect URL and exchanges it for an access token.
4. **API Request:** Using the access token, it calls the API to fetch the course data.
5. **JSON File Creation:** The retrieved data is saved in `class-schedules.json` for future use.

---

## Dependencies

- **axios**: For making HTTP requests.
- **qs**: For serializing form data.
- **cheerio**: For parsing HTML and extracting dynamic data.
- **fs**: For file system operations to save the JSON output.

Install these dependencies using:
```bash
npm install axios qs cheerio
```

---

## Troubleshooting

- **Login Failed Error:** Ensure your username and password are correct and that the university system is accessible.
- **Authorization Code Missing:** Check the login form and ensure the correct form action URL is being extracted.
- **API Request Failing:** Verify that the access token is being retrieved and that it’s valid for making API requests.

---

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.

---

## Contributing

Contributions are welcome! If you find any issues or want to enhance the script, feel free to submit a pull request.

---

## Author

Created by [Arnab Ghosh](https://github.com/ags-arnab). Feel free to contact me for any questions or collaboration opportunities!

---

Happy coding!
